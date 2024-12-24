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
              <n-button type="info" @click="qqLogin" :loading="qqLoginLoading"> QQ 登录 </n-button>
              <!--<n-button type="info" @click="oauthLogin" :loading="oauthLogin_loading">
                OAuth 登录
              </n-button>-->
            </n-space>
            <n-space justify="end">
              <n-button
                ghost
                style="--n-border: none"
                type="primary"
                @click="() => router.push({ name: 'Register' })"
              >
                没有账户？去注册
              </n-button>
              <n-button type="primary" @click="showTurnstile = true"> 登录</n-button>
              <!-- Turnstile -->
              <n-modal
                v-model:show="showTurnstile"
                :mask-closable="false"
                preset="card"
                title="请完成人机验证"
                style="min-width: 300px; width: min-content"
              >
                <vue-turnstile
                  site-key="0x4AAAAAAAEXAhvwOKerpBsb"
                  v-model="token"
                  @error="
                    (code) => {
                      showTurnstile = false
                      message.error(`验证码加载失败，错误代码: ${code}`)
                    }
                  "
                  @unsupported="
                    message.error('您的浏览器不支持加载验证码，请更换或升级浏览器后重试')
                  "
                />
              </n-modal>
            </n-space>
          </n-space>
        </div>
      </n-form>
    </n-grid-item>
  </n-grid>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useLoadingBar } from 'naive-ui'
import router from '@router'
import userData from '@/utils/stores/userData/store'
import Message from '@/utils/message'
import Notification from '@/utils/notification'
import logger from '@/utils/logger'
import api from '@/api'
import { getUrlKey } from '@/utils/request'
import VueTurnstile from 'vue-turnstile'

const message = new Message()
const notification = new Notification()

const formRef = ref(null)
const ldb = useLoadingBar()
const qqLoginLoading = ref(false)
// const oauthLogin_loading = ref(false)

let token = ref('')
let showTurnstile = ref(false)

const model = ref([
  {
    username: '',
    password: ''
  }
])

// 检查是否存在redirect值
// 这里一定要解码两次
const redirect = decodeURIComponent(decodeURIComponent(getUrlKey('redirect')))
if (redirect !== null) {
  logger.info('Redirect after login: ' + redirect)
}

watch(token, (newToken, _) => {
  showTurnstile.value = false
  login(newToken)
})

// 登录
async function login(turnstileToken) {
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
    rs = await api.v2.auth.login(model.value.username, model.value.password, turnstileToken)
  } catch (e) {
    message.error('请求失败: ' + e)
  }
  if (!rs) {
    ldb.error()
    return
  }
  if (rs.status === 200) {
    userData.commit('set_token', rs.data.token)
    userData.commit('set_user_info', rs.data)
    let rsx
    try {
      rsx = await api.v2.user.frp.token.get(rs.data.id)
    } catch (e) {
      message.error('请求失败: ' + e)
    }
    if (!rsx) message.error('获取访问令牌时发生错误')
    userData.commit('set_frp_token', rsx.data.frp_token)
    notification.success('登录成功', rs.data.username + '，欢迎回来！')
    router.push(redirect || '/dashboard')
    ldb.finish()
  } else {
    message.warning(rs.message)
    ldb.error()
  }
}

// QQ 登录
async function qqLogin() {
  qqLoginLoading.value = true
  let rs
  try {
    rs = await api.v2.auth.oauth.qq.login.get()
  } catch (e) {
    message.error('请求 QQ 登录失败: ' + e)
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
    margin-left: 20px;
    margin-right: 20px;
  }
}
</style>
