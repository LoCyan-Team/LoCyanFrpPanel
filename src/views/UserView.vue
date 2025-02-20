<template>
  <div class="container">
    <n-card class="info-card" style="text-align: center">
      <n-avatar round :size="80" :src="userData.getters.get_avatar + '?s=480'" />
      <br />
      <n-text style="font-size: 20px">
        {{ userData.getters.get_username }}
        <n-tag type="info">ID: {{ userData.getters.get_user_id }}</n-tag>
      </n-text>
      <br />
      <n-text style="color: gray"
        >本站使用 Cravatar 公用头像库 API ，可以前往
        <a target="_blank" href="https://cravatar.cn/">Cravatar</a> 或
        <a target="_blank" href="https://gravatar.com/">Gravatar</a>
        修改您的头像
      </n-text>
      <n-divider />
      <div class="actions">
        <n-h3>账户信息</n-h3>
        <n-text>邮箱: {{ userData.getters.get_email }}</n-text>
        <n-text>
          访问密钥:
          <n-tooltip>
            <template #trigger>
              <n-text
                v-clipboard="() => frpToken"
                v-clipboard:success="() => message.success('复制成功')"
                v-clipboard:error="() => message.error('复制失败')"
              >
                {{ obsFrpToken }}
              </n-text>
            </template>
            点击复制
          </n-tooltip>
        </n-text>
        <n-h3>第三方账户绑定</n-h3>
        <div class="three-side-buttons">
          <n-tooltip>
            <template #trigger>
              <n-spin :show="bind.qq.loading">
                <n-button :type="bind.qq.bond ? 'info' : 'tertiary'" @click="handleQqButton" circle>
                  <n-icon><Qq /></n-icon>
                </n-button>
              </n-spin>
            </template>
            <n-el v-if="bind.qq.bond">已绑定</n-el>
            <n-el v-else>未绑定</n-el>
          </n-tooltip>
        </div>
        <n-divider />
        <n-space>
          <n-button type="error" @click="resetFrpToken" secondary>重置访问密钥</n-button>
          <n-button type="error" @click="exitAllDevices" secondary>吊销全部登录设备</n-button>
        </n-space>
      </div>
    </n-card>
    <n-card class="info-card">
      <n-h3>修改密码</n-h3>
      <n-form ref="passwordRef" :model="passwordModel">
        <n-form-item label="原密码" path="oldPassword">
          <n-input
            v-model:value="passwordModel.oldPassword"
            type="password"
            placeholder="请输入旧密码"
          />
        </n-form-item>
        <n-form-item label="新密码" path="newPassword">
          <n-input
            v-model:value="passwordModel.newPassword"
            type="password"
            placeholder="请输入新密码"
          />
        </n-form-item>
        <n-form-item label="确认密码" path="confirmPassword">
          <n-input
            v-model:value="passwordModel.confirmPassword"
            type="password"
            placeholder="请重复新密码"
          />
        </n-form-item>
        <n-button
          :loading="passwordSubmitLoading"
          :disabled="passwordSubmitLoading"
          @click="changePassword"
          type="success"
        >
          提交
        </n-button>
      </n-form>
    </n-card>
    <n-card class="info-card" style="margin-bottom: 0;">
      <n-h3>修改邮箱</n-h3>
      <n-form ref="emailRef" :model="emailModel">
        <n-form-item label="新邮箱" path="email">
          <n-input v-model:value="emailModel.email" placeholder="请输入新邮箱" />
        </n-form-item>
        <n-form-item label="邮件验证码" path="verifyCode">
          <n-input v-model:value="emailModel.verifyCode" placeholder="请输入验证码" />
          <n-button
            @click="sendChangeEmailCode"
            :loading="emailCodeRequestLoading"
            :disabled="emailCodeRequestLoading"
            style="margin-left: 0.5rem"
            type="success"
            round
            ghost
          >
            发送验证码
          </n-button>
        </n-form-item>
        <n-button
          @click="changeEmail"
          :loading="emailSubmitLoading"
          :disabled="emailSubmitLoading"
          type="success"
        >
          提交
        </n-button>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import userData from '@/utils/stores/userData/store'
import { Qq } from '@vicons/fa'
import api from '@/api'
import logger from '@/utils/logger'
import Message from '@/utils/message.js'
import Dialog from '@/utils/dialog.js'

const message = new Message()
const dialog = new Dialog()

const frpToken = ref(userData.getters.get_frp_token)
const obsFrpToken = computed(() => {
  let rs = ''
  rs += frpToken.value.substring(0, 3)
  rs += '****************'
  rs += frpToken.value.substring(frpToken.value.length - 3, frpToken.value.length)
  return rs
})

const bind = ref({
  qq: {
    bond: false,
    loading: true
  }
})

async function handleQqButton() {
  if (bind.value.qq.bond) {
    dialog.warning('确定要取消绑定 QQ 吗？此操作不可逆', {
      onPositiveClick: async () => {
        let rs
        try {
          rs = await api.v2.auth.oauth.qq.bind.delete(userData.getters.get_user_id)
        } catch (e) {
          logger.error(e)
          message.error('请求失败: ' + e)
        }
        if (!rs) return
        if (rs.status === 200) {
          message.success('解绑成功')
          bind.value.qq.bond = false
        } else {
          message.error('解绑失败: ' + rs.message)
        }
      }
    })
  } else {
    bind.value.qq.loading = true
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
      bind.value.qq.loading = false
      const func = setTimeout(async () => await checkBindQqStatus(() => clearTimeout(func)), 5000)
    }
  }
}

// 检查 QQ 绑定状态
onMounted(async () => {
  await checkBindQqStatus()
})

async function checkBindQqStatus(func?: Function) {
  if (userData.getters.get_token !== '') {
    let rs
    try {
      rs = await api.v2.user.info.qq(userData.getters.get_user_id)
    } catch (e) {
      logger.error(e)
      message.error('获取 QQ 绑定状态失败: ' + rs.message)
    }
    if (!rs) return
    if (rs.status === 200) {
      bind.value.qq.bond = true
      bind.value.qq.loading = false
    } else if (rs.status === 404) {
      bind.value.qq.loading = false
    } else {
      message.error('获取 QQ 绑定状态失败: ' + rs.message)
    }
    if (func !== undefined) func()
  }
}
</script>

<script lang="ts">
import Notification from '@/utils/notification.js'
import { logout } from '@/utils/profile.js'
import { useRouter } from 'vue-router'

const message = new Message()
const dialog = new Dialog()
const notification = new Notification()

const router = useRouter()

async function resetFrpToken() {
  const data = {
    user_id: userData.getters.get_user_id
  }

  dialog.warning('确定要重置访问密钥吗? 该操作不可逆', {
    onPositiveClick: async () => {
      let rs
      try {
        rs = await api.v2.user.frp.token.post(data.user_id)
      } catch (e) {
        logger.error(e)
        message.error('请求失败: ' + e)
      }
      if (!rs) return
      if (rs.status === 200) {
        userData.commit('set_frp_token', rs.data.frp_token)
        message.success('重置成功')
      } else {
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
      let rs
      try {
        rs = await api.v2.user.token.all(data.user_id)
      } catch (e) {
        logger.error(e)
        message.error('请求失败: ' + e)
      }
      if (!rs) return
      if (rs.status === 200) {
        message.success('已全部退出')
        logout()
        notification.success('已登出', '感谢您的使用！')
        router.push({ name: 'Login' })
      } else {
        message.error('退出失败, 后端返回: ' + rs.message)
      }
    }
  })
}

// 修改密码
let passwordSubmitLoading = ref(false),
  passwordRef = ref(null),
  passwordModel = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

async function changePassword() {
  console.log(passwordModel.value)
  passwordSubmitLoading.value = true
  if (passwordModel.value.confirmPassword !== passwordModel.value.newPassword) {
    passwordSubmitLoading.value = false
    message.error('两次输入的密码不一致')
    return
  }
  const data = {
    userId: userData.getters.get_user_id,
    oldPassword: passwordModel.value.oldPassword,
    newPassword: passwordModel.value.newPassword
  }
  let rs
  try {
    rs = await api.v2.user.password(
      data.userId,
      undefined,
      data.oldPassword,
      data.newPassword,
      undefined
    )
  } catch (e) {
    logger.error(e)
    passwordSubmitLoading.value = false
    message.error('修改失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    message.success('修改成功')
  } else {
    message.error('密码修改失败: ' + rs.message)
  }
  passwordSubmitLoading.value = false
}

// 修改邮箱
let emailSubmitLoading = ref(false),
  emailCodeRequestLoading = ref(false),
  emailRef = ref(null),
  emailModel = ref({
    email: '',
    verifyCode: null
  })

async function changeEmail() {
  emailSubmitLoading.value = true
  let rs
  try {
    rs = await api.v2.user.email(userData.getters.get_user_id, emailModel.value.verifyCode)
  } catch (e) {
    logger.error(e)
    message.error('请求换绑失败: ' + e)
    emailSubmitLoading.value = false
  }
  if (!rs) return
  if (rs.status === 200) {
    message.success('更换邮箱绑定成功')
  } else {
    message.error(rs.message)
  }
  emailSubmitLoading.value = false
}

async function sendChangeEmailCode() {
  emailCodeRequestLoading.value = true
  let rs
  try {
    rs = await api.v2.email.email(userData.getters.get_user_id, emailModel.value.email)
  } catch (e) {
    logger.error(e)
    message.error('请求邮件验证码失败: ' + e)
    emailCodeRequestLoading.value = false
  }
  if (!rs) {
    return
  }
  if (rs.status === 200) {
    message.success('验证码已发送，如未收到请检查垃圾箱')
  } else {
    message.error(rs.message)
  }
  emailCodeRequestLoading.value = false
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 3rem;
}
.info-card {
  max-width: 600px;
  margin-bottom: 15px;
}
.actions {
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
}
.actions .n-h3 {
  margin-block: 0.5rem;
}

@media screen and (max-width: 800px) {
  .container {
    margin-top: 1rem;
    margin-bottom: -0.5rem;
  }
}
@media screen and (min-width: 800px) {
  .container {
    margin-bottom: 3rem;
  }
}
</style>
