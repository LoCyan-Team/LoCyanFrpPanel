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
              <n-button type="info" @click="qqLogin" :loading="qqLogin_loading"> QQ 登录 </n-button>
              <n-button type="info" @click="oauthLogin" :loading="oauthLogin_loading">
                OAuth 登录
              </n-button>
            </n-space>
            <n-space justify="end">
              <n-button type="primary" @click="login"> 登录</n-button>
              <n-button ghost style="--n-border: none" type="primary" @click="goRegister">
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
import { ref, onMounted } from 'vue'
import { useLoadingBar, useMessage } from 'naive-ui'
import { getUrlKey } from '@/utils/request'
import router from '@/router/index'
import userData from '@/utils/stores/userData'
import { sendErrorMessage } from '@/utils/message'
import logger from '@/utils/logger'
import api from '@/api'

const formRef = ref(null)
const message = useMessage()
const ldb = useLoadingBar()
const other_login = ref(false)
const qqLogin_loading = ref(false)
const oauthLogin_loading = ref(false)

const model = ref([
  {
    username: '',
    password: ''
  }
])

// 检查是否存在redirect值
const redirect = getUrlKey('redirect')
if (redirect !== null) {
  logger.info('Redirect after login: ' + redirect)
}

// 检查是否存在第三方登录返回值
// 针对QQ登录的处理
const code = getUrlKey('code')
const token = getUrlKey('token')
if (code !== null) {
  onMounted(async () => {
    other_login.value = true
    let rs
    try {
      rs = await api.v2.oauth.qq.loginByCode(code)
    } catch (e) {
      sendErrorMessage('登录失败: ' + e)
      router.push('/login')
    }
    if (!rs) return
    if (rs.status === 200) {
      message.success(rs.data.username + '，欢迎回来！')
      userData.commit('set_token', rs.data.token)
      // console.log(rs.data)
      userData.commit('set_user_info', rs.data)
      router.push(redirect || '/dashboard')
    }
  })
}

if (token !== null) {
  onMounted(async () => {
    other_login.value = true
    let rs
    try {
      rs = await api.v2.oauth.loginByToken(token)
    } catch (e) {
      sendErrorMessage('登录失败: ' + e)
      router.push('/login')
    }
    if (!rs) return
    if (rs.status === 200) {
      message.success(rs.data.username + '，欢迎回来！')
      userData.commit('set_token', rs.data.token)
      userData.commit('set_user_info', rs.data)
      router.push(redirect || '/dashboard')
    }
  })
}

function goRegister() {
  router.push('/register')
}

// LoCyan OAuth 2.0
function oauthLogin() {
  oauthLogin_loading.value = true
  window.location.href =
    'https://api-v2.locyanfrp.cn/api/v2/oauth/authorize?redirectUrl=http://' +
    window.location.host +
    '/login'
}

// 登录
async function login() {
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
  let rs
  try {
    rs = await api.v2.users.login(model.value.username, model.value.password)
  } catch (e) {
    sendErrorMessage('请求失败: ' + e)
  }
  if (!rs) {
    ldb.error()
    return
  }
  if (rs.status === 200) {
    message.success(rs.data.username + '，欢迎回来！')
    userData.commit('set_token', rs.data.token)
    // console.log(res.data)
    userData.commit('set_user_info', rs.data)
    router.push(redirect || '/dashboard')
    ldb.finish()
  } else {
    message.warning(rs.message)
    ldb.error()
  }
}

// QQ 登录
async function qqLogin() {
  qqLogin_loading.value = true
  let rs
  try {
    rs = await api.v2.oauth.qq.login(window.location.toString())
  } catch (e) {
    sendErrorMessage('请求 QQ 登录失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    window.location.href = rs.data.url
  }
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
