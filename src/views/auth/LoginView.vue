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
            @keyup.enter="loadCaptcha"
          />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            type="password"
            v-model:value="model.password"
            placeholder="密码"
            @keyup.enter="loadCaptcha"
          />
        </n-form-item>
        <div>
          <n-space justify="space-between">
            <n-space>
              <n-spin :show="threeSideLoading">
                <n-button type="info" @click="startQqLogin" circle>
                  <n-icon><Qq /></n-icon>
                </n-button>
              </n-spin>
              <n-spin :show="passkeyLoading">
                <n-button @click="startPasskeyLogin" ghost>通行密钥登录</n-button>
              </n-spin>
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
              <n-button type="primary" @click="loadCaptcha"> 登录</n-button>
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
                  v-model="turnstileToken"
                  @error="
                    (code) => {
                      if (`${code}`.startsWith('200')) {
                        message.error(`验证失败，状态异常，错误代码: ${code}`)
                      } else if (`${code}`.startsWith('300')) {
                        message.error(`验证失败，当前环境异常，错误代码: ${code}`)
                      } else if (`${code}`.startsWith('600')) {
                        message.error(`验证失败，错误代码: ${code}`)
                      } else {
                        message.error(`验证错误，错误代码: ${code}`)
                      }
                      setTimeout(() => {
                        showTurnstile = false
                      }, 3000)
                    }
                  "
                  @unsupported="
                    message.error('您的浏览器不支持加载验证码，请更换或升级浏览器后重试')
                  "
                />
              </n-modal>
              <n-modal
                v-model:show="showVAPTCHA"
                :mask-closable="false"
                preset="card"
                title="请完成人机验证"
                style="min-width: 300px; width: min-content"
              >
                <vaptcha-button
                  v-model="vaptchaToken"
                  v-model:server="vaptchaServer"
                  v-model:scene="vaptchaScene"
                  vid="67813e52dc0ff12924d9b311"
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

import { Qq } from '@vicons/fa'

import VueTurnstile from 'vue-turnstile'
import '@chongying-star/vue-vaptcha/style.css'
import { VaptchaButton } from '@chongying-star/vue-vaptcha'

const message = new Message()
const notification = new Notification()

const formRef = ref(null)
const ldb = useLoadingBar()
const threeSideLoading = ref(false),
  passkeyLoading = ref(false)
// const oauthLogin_loading = ref(false)

let captchaPreData,
  showTurnstile = ref(false),
  showVAPTCHA = ref(false)
let turnstileToken = ref('')
let vaptchaToken = ref(''),
  vaptchaServer = ref(''),
  vaptchaScene = 0

const model = ref([
  {
    username: '',
    password: ''
  }
])

// 检查是否存在redirect值
// 这里一定要解码两次
let redirectQuery = getUrlKey('redirect')
let redirect = decodeURIComponent(decodeURIComponent(redirectQuery))
if (redirectQuery !== null) {
  logger.info('Redirect after login: ' + redirect)
}

watch(turnstileToken, (newToken, _) => {
  showTurnstile.value = false
  login({
    id: captchaPreData.id,
    token: newToken
  })
})
watch(vaptchaToken, (newToken, _) => {
  showVAPTCHA.value = false
  login({
    id: captchaPreData.id,
    token: newToken,
    server: vaptchaServer.value
  })
})

let vaptchaInserted = false

async function loadCaptcha() {
  ldb.start()
  let rs
  try {
    rs = await api.v2.captcha('login')
  } catch (e) {
    message.error('请求验证码数据失败：' + e)
    logger.error(e)
    ldb.error()
  }
  if (rs.status === 200) {
    captchaPreData = {
      id: rs.data.id,
      type: rs.data.type
    }
    console.log(captchaPreData)
    switch (rs.data.type) {
      case 'turnstile':
        showTurnstile.value = true
        ldb.finish()
        break
      case 'vaptcha':
        if (!vaptchaInserted) {
          const script = document.createElement('script')
          script.src = 'https://v-cn.vaptcha.com/v3.js'
          document.head.appendChild(script)
          vaptchaInserted = true
          script.onload = () => {
            showVAPTCHA.value = true
            ldb.finish()
          }
        } else {
          showVAPTCHA.value = true
          ldb.finish()
        }
        break
      default:
        message.error('后端返回数据错误')
        ldb.error()
    }
  } else {
    message.error(rs.message)
    ldb.error()
  }
}

// 登录
async function login(captchaData) {
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
    rs = await api.v2.auth.login(
      model.value.username,
      model.value.password,
      captchaData.id,
      captchaData.token,
      captchaData.server
    )
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
    userData.commit('set_frp_token', rs.data.frp_token)
    notification.success('登录成功', rs.data.username + '，欢迎回来！')
    router.push(redirectQuery == null ? '/dashboard' : redirect)
    ldb.finish()
  } else {
    message.warning(rs.message)
    ldb.error()
  }
}

// QQ 登录
async function startQqLogin() {
  threeSideLoading.value = true
  let rs
  try {
    rs = await api.v2.auth.oauth.qq.login.get()
  } catch (e) {
    message.error('请求 QQ 登录失败: ' + e)
  }
  if (!rs) {
    threeSideLoading.value = false
    return
  }
  if (rs.status === 200) {
    window.location.href = rs.data.url
  }
  threeSideLoading.value = false
}

async function startPasskeyLogin() {
  passkeyLoading.value = true
  message.success('你是笨蛋吗？？！没见过的按钮也要点一下(≧^≦)ゞ')
  passkeyLoading.value = false
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
