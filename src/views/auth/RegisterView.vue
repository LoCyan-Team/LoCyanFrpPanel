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
        <n-form-item label="用户名" path="username">
          <n-input type="text" v-model:value="model.username" placeholder="用户名" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input type="text" v-model:value="model.email" placeholder="邮箱" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input type="password" v-model:value="model.password" placeholder="密码" />
        </n-form-item>
        <n-form-item label="确认密码" path="confirmPassword">
          <n-input
            type="password"
            v-model:value="model.confirmPassword"
            placeholder="再次输入密码"
          />
        </n-form-item>
        <n-form-item label="QQ & 邮件验证码" path="qq">
          <n-grid cols="6" :x-gap="8" :y-gap="8" item-responsive>
            <n-grid-item span="0:6 800:3">
              <n-input type="text" v-model:value="model.qq" placeholder="QQ号" />
            </n-grid-item>
            <n-grid-item span="0:6 800:2">
              <n-input type="text" v-model:value="model.verify" placeholder="验证码" />
            </n-grid-item>
            <n-grid-item span="0:6 800:1">
              <n-button
                ghost
                round
                type="success"
                @click="loadCaptcha"
                v-bind:disabled="verify.isClick"
              >
                {{ verify.msg }}
              </n-button>
              <n-text style="margin-left: 0.5rem" v-show="verify.resendTimer !== 0">
                {{ verify.resendTimer }}s
              </n-text>

              <captcha-component
                :show="showCaptcha"
                :type="captchaPreData.type"
                :vaptcha-scene="3"
                @error="
                  (code) => {
                    message.error('发生错误: ' + code)
                    showCaptcha = false
                  }
                "
                @unsupported="message.error('您的浏览器不支持加载验证码，请更换或升级浏览器后重试')"
                @callback="captchaCallback"
              />
            </n-grid-item>
          </n-grid>
        </n-form-item>
        <div style="display: flex; margin-bottom: 20px; justify-content: flex-end">
          <n-space>
            <n-button
              ghost
              type="success"
              style="--n-border: none"
              @click="() => router.push({ name: 'Login' })"
            >
              已有账户？去登录
            </n-button>
            <n-button type="success" @click="register"> 注册 </n-button>
          </n-space>
        </div>
      </n-form>
    </n-grid-item>
  </n-grid>
</template>

<script setup>
import { ref } from 'vue'
import { useLoadingBar, useMessage } from 'naive-ui'
import router from '@/router'
import API from '@/api'
import CaptchaComponent from '@/components/CaptchaComponent.vue'
import logger from '@/utils/logger'

const api = new API()

const refkey = 0
const formRef = ref(null)
const message = useMessage()
const ldb = useLoadingBar()

let captchaPreData = ref({
    id: null,
    type: ''
  }),
  showCaptcha = ref(false)

const model = ref([
  {
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
    qq: '',
    verify: null
  }
])

const verify = ref({
  isClick: false,
  msg: `发送验证码`,
  resendTimer: 0
})

let vaptchaInserted = false

async function loadCaptcha() {
  ldb.start()
  let rs
  try {
    rs = await api.v2.captcha.get({
      action: 'register'
    })
  } catch (e) {
    message.error('请求验证码数据失败：' + e)
    logger.error(e)
    ldb.error()
  }
  if (rs.status === 200) {
    captchaPreData.value = {
      id: rs.data.id,
      type: rs.data.type
    }
    // console.log(captchaPreData)
    switch (rs.data.type) {
      case 'turnstile':
        showCaptcha.value = true
        ldb.finish()
        break
      case 'vaptcha':
        if (!vaptchaInserted) {
          const script = document.createElement('script')
          script.src = 'https://v-cn.vaptcha.com/v3.js'
          document.head.appendChild(script)
          vaptchaInserted = true
          script.onload = () => {
            showCaptcha.value = true
            ldb.finish()
          }
        } else {
          showCaptcha.value = true
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

async function captchaCallback(token, server) {
  showCaptcha.value = false
  await sendCode({
    id: captchaPreData.value.id,
    token: token,
    server: server
  })
}

async function sendCode(captchaData) {
  // logger.info('发送邮件验证代码')
  verify.value.isClick = true
  verify.value.msg = `正在处理`
  ldb.start()
  let rs
  try {
    rs = await api.v2.email.register.get({
      email: model.value.email,
      captchaId: captchaData.id,
      captchaToken: captchaData.token,
      captchaServer: captchaData.server
    })
  } catch (e) {
    message.error('请求邮件验证代码失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    message.success('已发送，若未收到请检查收件箱')
    verify.value.msg = `已发送`
    verify.value.resendTimer = 60
    let timer = () =>
      setTimeout(() => {
        if (verify.value.resendTimer !== 0) {
          verify.value.resendTimer--
          timer()
        } else {
          verify.value.msg = `发送验证码`
          verify.value.isClick = false
        }
      }, 1000)
    timer()
  } else {
    message.error(rs.message)
    verify.value.isClick = false
    verify.value.msg = `发送验证码`
    verify.value.resendTimer = 0
  }
  ldb.finish()
  // logger.info('处理发送邮件验证代码事件完毕')
}

async function register() {
  ldb.start()
  let rs
  try {
    rs = await api.v2.auth.register.post({
      username: model.value.username,
      password: model.value.password,
      email: model.value.email,
      verifyCode: model.value.verify,
      qqCode: model.value.qq
    })
  } catch (e) {
    message.error('请求注册失败: ' + e)
  }
  if (!rs) return
  // const rs = post('https://api.locyanfrp.cn/User/DoReg', model.value)
  if (rs.status === 200) {
    message.success(rs.message)
    router.push({ name: 'Login' })
  } else {
    message.error(rs.message)
  }
  ldb.finish()
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
  },
  confirmpwd: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请再次输入密码'
  },
  qq: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入信息'
  },
  verify: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入信息'
  },
  email: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请输入邮箱')
      } else if (
        !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)
      ) {
        return new Error('邮箱格式错误')
      }
      return true
    },
    trigger: ['blur', 'input']
  }
}
</script>

<style scoped>
#item {
  margin-top: calc(50vh - 320px);
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
