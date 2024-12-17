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
        v-show="sendResetEmail"
      >
        <n-form-item label="新密码" path="password">
          <n-input type="password" v-model:value="model.password" placeholder="新密码" />
        </n-form-item>
        <n-form-item label="重复密码" path="confirm_password">
          <n-input type="password" v-model:value="model.confirmPassword" placeholder="重复密码" />
        </n-form-item>
        <n-form-item label="验证" path="username">
          <n-grid cols="6" :x-gap="8" :y-gap="8" item-responsive>
            <n-grid-item span="0:6 600:4">
              <n-input
                type="text"
                v-model:value="model.username"
                placeholder="用户名 / 邮箱"
                @keyup.enter="sendResetMail"
              />
            </n-grid-item>
            <n-grid-item span="0:6 600:1">
              <n-input
                type="text"
                v-model:value="model.verifyCode"
                placeholder="验证代码"
                @keyup.enter="sendResetMail"
              />
            </n-grid-item>
            <n-grid-item span="0:6 600:1">
              <n-button
                ghost
                round
                type="primary"
                @click="sendResetMail"
                v-bind:disabled="verify.isClick"
              >
                {{ verify.msg }}
              </n-button>
              <n-text style="margin-left: 0.5rem" v-show="verify.resendTimer !== 0"
                >{{ verify.resendTimer }}s</n-text
              >
            </n-grid-item>
          </n-grid>
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-space>
            <n-button
              ghost
              type="primary"
              style="--n-border: none"
              @click="() => router.push({ name: 'Login' })"
            >
              我想起密码了，带我去登录
            </n-button>
            <n-button type="primary" @click="doResetRequest">提交</n-button>
            <!--            <n-button type="primary" @click="sendResetMail" style="margin-right: 10px">-->
            <!--              发送邮件-->
            <!--            </n-button>-->
          </n-space>
        </div>
      </n-form>
      <!--      <n-form-->
      <!--        ref="formRef"-->
      <!--        :model="resetPassword"-->
      <!--        :rules="rules"-->
      <!--        label-width="auto"-->
      <!--        require-mark-placement="right-hanging"-->
      <!--        size="medium"-->
      <!--        id="item"-->
      <!--        v-show="!sendResetEmail"-->
      <!--      >-->
      <!--        <n-form-item label="新密码" path="password">-->
      <!--          <n-input type="text" v-model:value="resetPassword.password" placeholder="新密码" />-->
      <!--        </n-form-item>-->
      <!--        <n-form-item label="重复密码" path="confirm">-->
      <!--          <n-input type="text" v-model:value="resetPassword.confirm" placeholder="重复密码" />-->
      <!--        </n-form-item>-->
      <!--        <div style="display: flex; justify-content: flex-end">-->
      <!--          <n-space>-->
      <!--            <n-button type="primary" @click="doResetRequest" style="margin-right: 10px">-->
      <!--              提交-->
      <!--            </n-button>-->
      <!--          </n-space>-->
      <!--        </div>-->
      <!--      </n-form>-->
    </n-grid-item>
  </n-grid>
</template>

<script setup>
import { ref } from 'vue'
import { useLoadingBar, useMessage } from 'naive-ui'
import router from '@router'
import api from '@/api'

const formRef = ref(null)
const message = useMessage()
const ldb = useLoadingBar()
const sendResetEmail = ref(true)

const model = ref([
  {
    username: '',
    password: '',
    confirmPassword: '',
    verifyCode: ''
  }
])

const verify = ref({
  isClick: false,
  msg: `发送验证码`,
  resendTimer: 0
})

// const resetPassword = ref([
//   {
//     password: '',
//     confirmPassword: '',
//     verify_code: ''
//   }
// ])

// 检查是否存在redirect值
// const code = getUrlKey('code')
// if (code !== null) {
//   logger.info('重置密码标识符: ' + code)
//   sendResetEmail.value = false
// }

async function doResetRequest() {
  if (model.value.password !== model.value.confirmPassword) {
    message.error('两次输入的密码不一致，请核对')
    return
  }
  // if (code === '' || code === undefined) {
  //   message.error('非法请求！')
  //   return
  // }
  ldb.start()
  let rs
  try {
    rs = await api.v2.user.password(
      model.value.username,
      undefined,
      model.value.password,
      model.value.verifyCode
    )
  } catch (e) {
    message.error('请求重置密码失败: ' + e)
  }
  if (!rs) {
    ldb.error()
    return
  }
  if (rs.status === 200) {
    message.success(rs.message)
  } else {
    message.error(rs.message)
  }
  ldb.finish()
}

async function sendResetMail() {
  verify.value.isClick = true
  verify.value.msg = `正在处理`
  ldb.start()
  let rs
  try {
    rs = await api.v2.email.password(model.value.username)
  } catch (e) {
    message.error('请求失败: ' + e)
  }
  if (!rs) {
    ldb.error()
    verify.value.msg = `发送验证码`
    verify.value.isClick = false
    verify.value.resendTimer = 0
    return
  }
  if (rs.status === 200) {
    message.success(rs.message)
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
    verify.value.msg = `发送验证码`
    verify.value.isClick = false
    verify.value.resendTimer = 0
  }
  ldb.finish()
}

const rules = {
  password: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入密码'
  },
  confirm_password: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请确认密码'
  },
  username: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入用户名或邮箱'
  }
}
</script>
<style scoped>
#item {
  margin-top: calc(50vh - 210px);
  margin-left: 240px;
  margin-right: 240px;
}

@media (max-width: 1300px) {
  #item {
    margin-top: calc(50vh - 210px);
    margin-left: 20px;
    margin-right: 20px;
  }
}
</style>
