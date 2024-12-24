<template>
  <n-drawer v-model:show="show" :width="dialogWidth">
    <n-drawer-content title="个人信息" closable>
      <n-avatar round :size="80" :src="userData.getters.get_avatar" />
      <br />
      <n-text style="font-size: 20px">{{ userData.getters.get_username }} </n-text>
      <br />
      <n-text style="color: gray"
        >本站使用 Cravatar 公用头像库 API ，可以前往
        <a target="_blank" href="https://cravatar.cn/">Cravatar</a> 或
        <a target="_blank" href="https://gravatar.com/">Gravatar</a>
        修改您的头像
      </n-text>
      <br />
      <n-h2>社交账号绑定</n-h2>
      <n-space>
        <n-h5 style="margin: 3px"> QQ:</n-h5>
        <n-button
          type="info"
          v-bind:disabled="bindQQ.isDisable"
          @click="doBindQQ"
          :loading="binding"
        >
          {{ bindQQ.msg }}
        </n-button>
        <n-button
          type="error"
          v-bind:disabled="bindQQ.unBindDisable"
          @click="unBindQQ"
          :loading="binding"
        >
          {{ bindQQ.unBindMsg }}
        </n-button>
      </n-space>
      <n-h2>修改信息</n-h2>
      <n-text style="color: gray">一旦修改信息，您的登录账户也会随之改变！ </n-text>
      <n-space vertical>
        <!-- 邮箱 -->
        <n-space>
          <n-h5 style="margin: 3px"> 邮箱：</n-h5>
          <n-input v-bind:disabled="tEmail.isEditDisable" v-model:value="tEmail.email" />
          <n-button @click="changeEmail" v-bind:disabled="tEmail.isBtnDisable" type="info"
            >{{ tEmail.msg }}
          </n-button>
          <n-space v-bind:style="tEmail.isEditDisable ? 'display: none;' : ''">
            <n-input
              v-model:value="tEmail.verify.code"
              style="max-width: 200px"
              placeholder="请输入验证码"
            />
            <n-button
              round
              ghost
              type="primary"
              v-bind:disabled="tEmail.verify.isClick"
              @click="sendChangeEmailCode"
              >{{ tEmail.verify.msg }}
            </n-button>
          </n-space>
        </n-space>
        <!-- 密码 -->
        <n-space vertical>
          <n-h5 style="margin: 3px"> 密码：</n-h5>
          <n-input v-model:value="tPassword.oldPassword" placeholder="原密码" type="password" />
          <n-input v-model:value="tPassword.newPassword" placeholder="新密码" type="password" />
          <n-input
            v-model:value="tPassword.confirmPassword"
            placeholder="重复密码"
            type="password"
          />
          <n-button @click="changePassword" :loading="tPassword.isLoading" type="info"
            >{{ tPassword.msg }}
          </n-button>
        </n-space>
        <n-space>
          <n-h5 style="margin: 3px"> 其他操作：</n-h5>
          <n-button type="error" :loading="resetFrpTokenLoading" @click="resetFrpToken">
            重置访问密钥
          </n-button>
          <n-button type="error" :loading="exitAllDevicesLoading" @click="exitAllDevices">
            吊销全部登录设备
          </n-button>
        </n-space>
      </n-space>
      <template #footer>
        <n-button ghost type="primary" @click="doLogOut"> 退出登录 </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { logout } from '@/utils/profile'
import userData from '@/utils/stores/userData/store'
import Message from '@/utils/message'
import Dialog from '@/utils/dialog'
import Notification from '@/utils/notification'
import { onMounted, ref } from 'vue'
import { useLoadingBar } from 'naive-ui'
import api from '@/api'
import logger from '@/utils/logger'
import router from '@router'

const message = new Message()
const dialog = new Dialog()
const notification = new Notification()

const dialogWidth = ref('30vw')
const ldb = useLoadingBar()
const binding = ref(false)
const resetFrpTokenLoading = ref(false)
const exitAllDevicesLoading = ref(false)
if (document.body.clientWidth <= 800) {
  dialogWidth.value = '75vw'
}

const bindQQ = ref({
  isDisable: true,
  msg: '正在获取',
  unBindDisable: true,
  unBindMsg: '正在获取'
})

const tEmail = ref({
  email: userData.getters.get_email,
  msg: '修改',
  isEditDisable: true,
  isBtnDisable: false,
  verify: {
    isClick: false,
    msg: '获取验证码',
    code: ''
  }
})

const tPassword = ref({
  msg: '重置',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  isLoading: false
})

// 检查 QQ 绑定状态
onMounted(async () => {
  if (userData.getters.get_token !== '') {
    let rs
    try {
      rs = await api.v2.user.info.qq(userData.getters.get_user_id)
    } catch (e) {
      logger.error(e)
      bindQQ.value.isDisable = true
      bindQQ.value.msg = '未知'
    }
    if (!rs) return
    if (rs.status === 200) {
      bindQQ.value.isDisable = true
      bindQQ.value.msg = '已绑定'
      bindQQ.value.unBindDisable = false
      bindQQ.value.unBindMsg = '解除绑定'
    } else if (rs.status === 404) {
      bindQQ.value.isDisable = false
      bindQQ.value.msg = '点击绑定'
      bindQQ.value.unBindDisable = true
      bindQQ.value.unBindMsg = '尚未绑定'
    } else {
      message.error('获取 QQ 绑定状态失败: ' + rs.message)
    }
  }
})

async function changeEmail() {
  if (tEmail.value.isEditDisable) {
    tEmail.value.isEditDisable = false
    tEmail.value.msg = '确认'
  } else if (!tEmail.value.isEditDisable) {
    //换绑
    tEmail.value.isBtnDisable = true
    let rs
    ldb.start()
    try {
      rs = await api.v2.user.email(userData.getters.get_user_id, tEmail.value.verify.code)
    } catch (e) {
      logger.error(e)
      message.error('请求换绑失败: ' + e)
      tEmail.value.isEditDisable = true
      tEmail.value.isBtnDisable = false
      tEmail.value.msg = '修改'
    }
    if (!rs) {
      ldb.error()
      return
    }
    if (rs.status === 200) {
      message.success(rs.message)
      tEmail.value.isEditDisable = true
      tEmail.value.isBtnDisable = false
      tEmail.value.msg = '修改'
    } else {
      message.error(rs.message)
      tEmail.value.isEditDisable = true
      tEmail.value.isBtnDisable = false
      tEmail.value.msg = '修改'
    }
    ldb.finish()
  }
}

async function sendChangeEmailCode() {
  tEmail.value.verify.isClick = true
  tEmail.value.verify.msg = ref(`正在处理`)
  ldb.start()
  let rs
  try {
    rs = await api.v2.email.email(userData.getters.get_user_id, tEmail.value.email)
  } catch (e) {
    logger.error(e)
    message.error('请求邮件验证码失败: ' + e)
    tEmail.value.verify.isClick = false
    tEmail.value.verify.msg = ref(`发送验证码`)
  }
  if (!rs) {
    ldb.error()
    return
  }
  if (rs.status === 200) {
    message.success(rs.message)
    tEmail.value.verify.msg = ref(`已发送`)
  } else {
    message.error(rs.message)
    tEmail.value.verify.isClick = false
    tEmail.value.verify.msg = ref(`发送验证码`)
  }
  ldb.finish()
}

async function doBindQQ() {
  binding.value = true
  let rs
  try {
    rs = await api.v2.auth.oauth.qq.bind.get(userData.getters.get_user_id)
  } catch (e) {
    logger.error(e)
    message.error('请求失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    window.open(rs.data.url)
    binding.value = false
  }
}

async function unBindQQ() {
  binding.value = true
  let rs
  try {
    rs = await api.v2.auth.oauth.qq.bind.delete(userData.getters.get_user_id)
  } catch (e) {
    logger.error(e)
    binding.value = false
    bindQQ.value.unBindDisable = false
    bindQQ.value.unBindMsg = '解绑失败'
    message.error('请求失败: ' + e)
    setTimeout(() => {
      bindQQ.value.unBindMsg = '解除绑定'
    }, 1000)
  }
  if (!rs) return
  if (rs.status === 200) {
    binding.value = false
    bindQQ.value.unBindDisable = true
    bindQQ.value.unBindMsg = '解绑成功'
    bindQQ.value.isDisable = false
    bindQQ.value.msg = '点击绑定'
    setTimeout(() => {
      bindQQ.value.unBindMsg = '尚未绑定'
    }, 1000)
  } else {
    binding.value = false
    bindQQ.value.unBindDisable = false
    bindQQ.value.unBindMsg = '解绑失败'
    message.error('解绑失败，服务器错误')
    setTimeout(() => {
      bindQQ.value.unBindMsg = '解除绑定'
    }, 1000)
  }
}

function doLogOut() {
  changeUserInfoShow(false)
  logout()
  notification.success('已登出', '感谢您的使用！')
  router.push({ name: 'Login' })
}

async function changePassword() {
  tPassword.value.isLoading = true
  if (tPassword.value.confirmPassword !== tPassword.value.newPassword) {
    tPassword.value.isLoading = false
    message.error('两次输入的密码不一致')
    return
  }
  const data = {
    user_id: userData.getters.get_user_id,
    oldPassword: tPassword.value.oldPassword,
    newPassword: tPassword.value.newPassword
  }
  let rs
  try {
    rs = await api.v2.user.password(data.user_id, data.oldPassword, data.newPassword, undefined)
  } catch (e) {
    logger.error(e)
    tPassword.value.isLoading = false
    message.error('修改失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    tPassword.value.isLoading = false
    message.success('修改成功')
    doLogOut()
  } else {
    tPassword.value.isLoading = false
    message.error('密码修改失败, 后端返回: ' + rs.message)
  }
}

async function resetFrpToken() {
  const data = {
    user_id: userData.getters.get_user_id
  }

  dialog.warning('你确定要重置访问密钥吗? 该操作不可逆', {
    onPositiveClick: async () => {
      resetFrpTokenLoading.value = true
      let rs
      try {
        rs = await api.v2.user.frp.token.post(data.user_id)
      } catch (e) {
        logger.error(e)
        resetFrpTokenLoading.value = false
        message.error('请求失败: ' + e)
      }
      if (!rs) return
      if (rs.status === 200) {
        resetFrpTokenLoading.value = false
        userData.commit('set_frp_token', rs.data.frp_token)
        message.success('重置成功')
      } else {
        resetFrpTokenLoading.value = false
        message.error('重置失败, 后端返回: ' + rs.message)
      }
    }
  })
}

async function exitAllDevices() {
  const data = {
    user_id: userData.getters.get_user_id
  }

  dialog.warning('你确定要登出全部设备吗, 所有登录将会失效', {
    onPositiveClick: async () => {
      exitAllDevicesLoading.value = true
      let rs
      try {
        rs = await api.v2.user.token.all(data.user_id)
      } catch (e) {
        logger.error(e)
        exitAllDevicesLoading.value = false
        message.error('请求失败: ' + e)
      }
      if (!rs) return
      // const rs = await deleteReq('https://api-v2.locyanfrp.cn/api/v2/users/reset/token/all', data)
      if (rs.status === 200) {
        exitAllDevicesLoading.value = false
        message.success('已全部退出')
        doLogOut()
      } else {
        exitAllDevicesLoading.value = false
        message.error('退出失败, 后端返回: ' + rs.message)
      }
    }
  })
}
</script>

<script>
import { ref } from 'vue'

const show = ref(false)

export const changeUserInfoShow = (status) => {
  show.value = status
}
</script>
