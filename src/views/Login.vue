<template>
  <n-grid cols="1" item-responsive>
    <n-grid-item span="1">
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="medium"
        id="item"
        v-show="!other_login"
      >
        <n-form-item label="用户名 / 邮箱" path="username">
          <n-input
            type="text"
            v-model:value="model.username"
            placeholder="用户名"
            @keyup.enter="login"
          />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            type="password"
            v-model:value="model.password"
            placeholder="密码"
            @keyup.enter="login"
          />
        </n-form-item>
        <div>
          <n-space justify="space-between">
            <n-space>
              <n-button type="info" @click="qqlogin" :loading="qqlogin_loading"> QQ 登录 </n-button>
              <n-button type="info" @click="oauthlogin" :loading="oauthlogin_loading">
                OAuth 登录
              </n-button>
            </n-space>
            <n-space justify="end">
              <n-button type="primary" @click="login"> 登录</n-button>
              <n-button ghost style="--n-border: none" type="primary" @click="goregister">
                没有账户？去注册
              </n-button>
            </n-space>
          </n-space>
        </div>
      </n-form>
      <div v-show="other_login">
        <n-spin
          description="正在进行第三方登录处理"
          style="display: flex; justify-content: center; margin-top: 30vh"
        ></n-spin>
      </div>
    </n-grid-item>
  </n-grid>
</template>

<script setup>
import { ref } from 'vue'
import { useLoadingBar, useMessage } from 'naive-ui'
import { get, getUrlKey, post } from '../utils/request.js'
import router from '../router/index.js'
import store from '../utils/stores/store.js'

const formRef = ref(null)
const message = useMessage()
const ldb = useLoadingBar()
const other_login = ref(false)
const qqlogin_loading = ref(false)
const oauthlogin_loading = ref(false)

const model = ref([
  {
    username: '',
    password: ''
  }
])

// 检查是否存在redirect值
const redirect = getUrlKey('redirect')
if (redirect !== null) {
  console.log('登录后返回' + redirect)
}

// 检查是否存在第三方登录返回值
// 针对QQ登录的处理
const code = getUrlKey('code')
const token = getUrlKey('token')
if (code !== null) {
  other_login.value = true
  const rs = get('https://api-v2.locyanfrp.cn/api/v2/oauth/qq/loginByCode?code=' + code, [])
  rs.then((res) => {
    if (res.status === 200) {
      message.success(res.data.username + '，欢迎回来！')
      store.commit('set_token', res.data.token)
      store.commit('set_user_info', res.data)
      router.push(redirect || '/dashboard')
    }
  })
}

if (token !== null) {
  other_login.value = true
  const rs = get('https://api-v2.locyanfrp.cn/api/v2/oauth/loginByToken?token=' + token)
  rs.then((res) => {
    if (res.status === 200) {
      message.success(res.data.username + '，欢迎回来！')
      store.commit('set_token', res.data.token)
      store.commit('set_user_info', res.data)
      router.push(redirect || '/dashboard')
    }
  })
}

function goregister() {
  router.push('/register')
}

function oauthlogin() {
  oauthlogin_loading.value = true
  window.location.href =
    'https://api-v2.locyanfrp.cn/api/v2/oauth/authorize?redirectUrl=http://' +
    window.location.host +
    '/login'
}

function login() {
  ldb.start()
  if (
    model.value.username === null ||
    model.value.password === null ||
    model.value.username === '' ||
    model.value.password === ''
  ) {
    message.error('账号 / 密码 不可为空！')
    ldb.error()
    return
  }
  const rs = post('https://api-v2.locyanfrp.cn/api/v2/users/login', model.value)
  rs.then((res) => {
    if (res.status === 200) {
      message.success(model.value.username + '，欢迎回来！')
      store.commit('set_token', res.data.token)
      store.commit('set_user_info', res.data)
      router.push(redirect || '/dashboard')
      ldb.finish()
    } else {
      message.warning(res.data.msg)
      ldb.error()
    }
  })
}

function qqlogin() {
  qqlogin_loading.value = true
  const rs = get(
    'https://api-v2.locyanfrp.cn/api/v2/oauth/qq/login?redirect_url=' + window.location.toString(),
    []
  )
  rs.then((res) => {
    if (res.status === 200) {
      window.location.href = res.data.url
    }
  })
}

const rules = {
  username: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入用户名'
  },
  password: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入密码'
  }
}
</script>

<style scoped>
#item {
  margin-top: calc(50vh - 160px);
  margin-left: 240px;
  margin-right: 240px;
}

@media (max-width: 1300px) {
  #item {
    margin-top: calc(50vh - 160px);
    margin-left: 20px;
    margin-right: 20px;
  }
}
</style>
