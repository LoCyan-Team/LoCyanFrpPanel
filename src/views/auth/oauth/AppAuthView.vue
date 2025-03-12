<template>
  <div class="flex-center outbox">
    <n-h2>应用授权</n-h2>
    <n-spin style="width: 100%; max-width: 500px" v-if="!error" :show="loading">
      <n-card>
        <div v-if="valid">
          <n-h3>{{ applicationName }}</n-h3>
          <n-text>{{ applicationDescription }}</n-text>
          <n-divider></n-divider>
          <n-text>确认是否要授权此应用访问您的数据？这将授予应用获取以下权限：</n-text>
          <div>
            <n-ul>
              <n-li v-for="permission in applicationPermissionRequested">
                <n-text>{{ permission.node }}</n-text>
                <n-text style="margin-left: 1rem; float: right">{{
                  permission.description
                }}</n-text>
              </n-li>
            </n-ul>
          </div>
          <n-divider></n-divider>
          <div class="buttons">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-avatar :src="userAvatarUrl" round></n-avatar>
              </template>
              将以此身份继续: {{ username }}
            </n-tooltip>
            <n-button
              :loading="acceptLoading"
              :disabled="acceptLoading"
              type="success"
              @click="doAuthorize"
              >同意</n-button
            >
            <n-button :loading="denyLoading" :disabled="denyLoading" @click="deny">拒绝</n-button>
          </div>
          <n-divider></n-divider>
          <div style="text-align: center">
            <n-text>
              授权后，您将被重定向到以下地址:
              <br />
              {{ urlKeys.redirectUrl }}
            </n-text>
          </div>
        </div>
        <div v-else>
          <n-text>无效请求，请检查 URL 参数</n-text>
        </div>
      </n-card>
    </n-spin>
    <div v-else>
      <n-text>初始化失败，请重试</n-text>
    </div>
  </div>
</template>

<style scoped>
.outbox {
  margin: 3rem;
}
.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.buttons .n-button {
  margin-left: 1rem;
  float: right;
}
@media screen and (max-width: 650px) {
  .outbox {
    margin-inline: 0.5rem;
  }
}
</style>

<script setup lang="ts">
import userData from '@/utils/stores/userData/store'
import { getUrlKey } from '@/utils/request'
import { onMounted, ref } from 'vue'
import Message from '@/utils/message'
import Notification from '@/utils/notification'
import api from '@/api'
import logger from '@/utils/logger'

const message = new Message()
const notification = new Notification()

const loading = ref(true)
const error = ref(false)
const valid = ref(true)

const urlKeys = {
  appId: getUrlKey('app_id'),
  scopes: decodeURIComponent(getUrlKey('scopes')),
  redirectUrl: decodeURIComponent(getUrlKey('redirect_url'))
}

if (urlKeys.appId == null || urlKeys.scopes == null || urlKeys.redirectUrl == null) {
  loading.value = false
  valid.value = false
}

const applicationName = ref('')
const applicationDescription = ref('')
const applicationPermissionRequested = ref([])

const username = ref('')
const userAvatarUrl = ref('')

username.value = userData.getters.get_username
userAvatarUrl.value = userData.getters.get_avatar

userData.subscribe((mutation: any, state: any) => {
  if (mutation.type === 'set_avatar' || mutation.type === 'set_user_info') {
    userAvatarUrl.value = state.avatar
  }
})

const acceptLoading = ref(false)
const denyLoading = ref(false)

async function doAuthorize() {
  acceptLoading.value = true
  let permissionIds: Array<number> = []
  applicationPermissionRequested.value.forEach((permission) => {
    permissionIds.push(permission.id)
  })
  let rs
  try {
    rs = await api.v2.auth.oauth.authorize(
      userData.getters.get_user_id,
      urlKeys.appId,
      urlKeys.redirectUrl,
      permissionIds
    )
  } catch (e) {
    logger.error(e)
    message.error('授权失败: ' + e)
    acceptLoading.value = false
    return
  }
  if (!rs) return
  if (rs.status === 200) {
    message.success('授权成功，正在重定向，请不要刷新浏览器')

    if (urlKeys.redirectUrl.includes('?')) {
      // 包含查询字符串标识
      if (urlKeys.redirectUrl[urlKeys.redirectUrl.length - 1] == '?') {
        // 末尾字符为查询字符串标识
        window.location.href = `${urlKeys.redirectUrl}refresh_token=${rs.data.refresh_token}`
      } else {
        // 末尾字符不为查询字符串标识
        window.location.href = `${urlKeys.redirectUrl}&refresh_token=${rs.data.refresh_token}`
      }
    } else if (urlKeys.redirectUrl.includes('#')) {
      // 包含段落标识
      const strArr = urlKeys.redirectUrl.split('#')
      window.location.href = `${strArr[0]}?refresh_token=${rs.data.refresh_token}#${strArr[1]}`
    } else {
      // 不接受同时存在查询字符串与段落标识
      // 普通 URL
      window.location.href = `${urlKeys.redirectUrl}?refresh_token=${rs.data.refresh_token}`
    }
  } else if (rs.status === 403) {
    notification.error('授权失败', `服务器拒绝授权，原因: ${rs.message}`)
  } else {
    message.error('授权失败: ' + rs.message)
  }
  acceptLoading.value = false
}
function deny() {
  denyLoading.value = true
  if (urlKeys.redirectUrl.includes('?')) {
    // 包含查询字符串标识
    if (urlKeys.redirectUrl[urlKeys.redirectUrl.length - 1] == '?') {
      // 末尾字符为查询字符串标识
      window.location.href = `${urlKeys.redirectUrl}error=user.deny`
    } else {
      // 末尾字符不为查询字符串标识
      window.location.href = `${urlKeys.redirectUrl}&error=user.deny`
    }
  } else if (urlKeys.redirectUrl.includes('#')) {
    // 包含段落标识
    const strArr = urlKeys.redirectUrl.split('#')
    window.location.href = `${strArr[0]}?error=user.deny#${strArr[1]}`
  } else {
    // 不接受同时存在查询字符串与段落标识
    // 普通 URL
    window.location.href = `${urlKeys.redirectUrl}?error=user.deny`
  }
}

onMounted(async () => {
  let permissionList

  async function initAppInfo(): Promise<boolean> {
    let rs
    try {
      rs = await api.v2.app.info(userData.getters.get_user_id, urlKeys.appId)
    } catch (e) {
      logger.error(e)
      message.error(e)
      return false
    }
    if (!rs) return false
    if (rs.status === 200) {
      applicationName.value = rs.data.name
      applicationDescription.value = rs.data.description
      return true
    } else if (rs.status === 404) {
      message.error('未找到此应用程序')
      valid.value = false
      return true
    } else {
      message.error(rs.message)
    }
    return false
  }

  async function initPermissions(): Promise<boolean> {
    let rs
    try {
      rs = await api.v2.auth.oauth.permission.all(userData.getters.get_user_id)
    } catch (e) {
      logger.error(e)
      message.error(e)
      return false
    }
    if (!rs) return false
    if (rs.status === 200) {
      // logger.info(rs.data)
      permissionList = rs.data.list
      return true
    } else {
      message.error(rs.message)
    }
    return false
  }

  async function initAppPermissions(): Promise<boolean> {
    const permissions = urlKeys.scopes.split(',')
    permissionList.forEach((permission) => {
      if (permissions.includes(permission.node))
        applicationPermissionRequested.value.push(permission)
    })
    return true
    // applicationPermissionRequested
  }

  let init1 = await initAppInfo()
  let init2 = await initPermissions()
  let init3 = await initAppPermissions()
  if (init1 && init2 && init3) {
    loading.value = false
  } else {
    error.value = true
  }
})
</script>
