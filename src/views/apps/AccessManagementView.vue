<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-identification-card"></i>
    <n-text type="success"> 授权管理</n-text>
  </n-h1>
  <n-spin :show="loading">
    <n-empty v-if="list.length === 0"></n-empty>
    <n-card
      v-else
      v-for="app in list"
      style="margin-bottom: 1rem"
      content-style="padding: 0"
      :title="app.name"
    >
      <n-text style="margin: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left)">
        应用介绍: {{ app.description }}
      </n-text>
      <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;">
        <n-tab-pane name="授权信息">
          <n-text>活动会话数: {{ app.sessions.length }}</n-text>
          <br />
          <n-text>已授予的权限:&nbsp;</n-text>
          <n-text v-for="permissionId in app.authorizedPermissions">
            {{ permissionList.filter((it) => it.id == permissionId)[0]['node']
            }}{{ [...app.authorizedPermissions].reverse()[0] != permissionId ? ', ' : '' }}
          </n-text>
        </n-tab-pane>
        <n-tab-pane style="padding-block: 0.5rem" name="活动会话">
          <n-list style="margin-right: 2.5rem">
            <n-list-item v-for="session in app.sessions" :key="session.id">
              <n-text>会话 ID: {{ session.id }}</n-text>
              <br />
              <n-text>授权时间: {{ new Date(session.authorizeTime) }}</n-text>
              <template #suffix>
                <n-button type="error" @click="revokeSessionAuthorize(app.id, session.id)" secondary
                  >撤销授权</n-button
                >
              </template>
            </n-list-item>
          </n-list>
        </n-tab-pane>
      </n-tabs>
      <template #action>
        <n-button @click="revokeAppAuthorize(app.id)" type="error">撤销应用程序授权</n-button>
      </template>
    </n-card>
  </n-spin>
</template>
<script setup lang="ts">
import userData from '@/utils/stores/userData/store'
import { ref, onMounted } from 'vue'
import API from '@/api'
import logger from '@/utils/logger'
import Message from '@/utils/message'
import Dialog from '@/utils/dialog'

const api = new API()
const message = new Message()
const dialog = new Dialog()

const loading = ref<boolean>(true)
const list = ref<
  Array<{
    id: number
    name: string
    description: string
    authorizedPermissions: Array[]
    sessions: Array<{
      id: number
      authorizeTime: number
    }>
  }>
>([])
const permissionList = ref<Array<{}>>([])

async function revokeAppAuthorize(appId: number | undefined) {
  dialog.warning('确认要撤销授权吗？撤销后应用将不具有访问权限', {
    onPositiveClick: async () => {
      let rs
      try {
        rs = await api.v2.auth.oauth.authorized.app.delete({
          userId: userData.getters.get_user_id,
          appId: appId
        })
      } catch (e) {
        logger.error(e)
        message.error(e)
        return false
      }
      if (!rs) return false
      if (rs.status === 200) {
        if (appId === undefined) list.value.clear()
        else list.value = list.value.filter((it) => it.id != appId)
        message.success('撤销授权成功')
      } else {
        message.error(rs.message)
      }
    }
  })
}

async function revokeSessionAuthorize(appId: number, sessionId: number | undefined) {
  dialog.warning('确认要撤销授权吗？撤销后应用将不具有访问权限', {
    onPositiveClick: async () => {
      let rs
      try {
        rs = await api.v2.auth.oauth.authorized.session.delete({
          userId: userData.getters.get_user_id,
          appId: appId,
          sessionId: sessionId
        })
      } catch (e) {
        logger.error(e)
        message.error(e)
        return false
      }
      if (!rs) return false
      if (rs.status === 200) {
        const newList = []
        list.value.forEach((it) => {
          if (it.it == appId) {
            let item = it
            item.session = item.session.filter((it) => it.id != sessionId)
            newList.push(item)
          } else {
            newList.push(it)
          }
        })
        message.success('撤销授权成功')
      } else {
        message.error(rs.message)
      }
    }
  })
}

onMounted(async () => {
  async function initPermissions(): Promise<boolean> {
    let rs
    try {
      rs = await api.v2.auth.oauth.permission.all.get({
        userId: userData.getters.get_user_id
      })
    } catch (e) {
      logger.error(e)
      message.error(e)
      return false
    }
    if (!rs) return false
    if (rs.status === 200) {
      // logger.info(rs.data)
      permissionList.value = rs.data.list
      return true
    } else {
      message.error(rs.message)
    }
    return false
  }

  async function initAuthorizedList(): Promise<boolean> {
    let rs
    try {
      rs = await api.v2.auth.oauth.authorized.all.get({
        userId: userData.getters.get_user_id
      })
    } catch (e) {
      logger.error(e)
      message.error(e)
      return false
    }
    if (!rs) return false
    if (rs.status === 200) {
      // logger.info(rs.data)
      if (rs.data.list.length == 0) return true
      rs.data.list.forEach(
        (item: {
          id: number
          name: string
          description: string
          authorizedPermissions: Array[]
          sessions: Array<{
            id: number
            authorizeTime: number
          }>
        }) => {
          let sessions: Array<{
            id: number
            authorizeTime: number
          }> = []
          item.sessions.forEach((session: { id: number; authorizeTime: number }) => {
            sessions.push({
              id: session.id,
              authorizeTime: session.authorize_time
            })
          })
          list.value.push({
            id: item.app_id,
            name: item.app_name,
            description: item.app_description,
            authorizedPermissions: item.authorized_permissions,
            sessions: sessions
          })
        }
      )
      return true
    } else {
      message.error(rs.message)
    }
    return false
  }

  const init1 = await initPermissions()
  const init2 = await initAuthorizedList()
  if (init1 && init2) {
    loading.value = false
  }
})
</script>
