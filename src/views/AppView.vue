<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-package"></i>
    <n-text type="primary"> OAuth2.0 应用</n-text>
  </n-h1>
  <!-- TODO: 用户应用管理界面 -->
  <n-grid :y-gap="3" :x-gap="20" cols="3" item-responsive>
    <n-grid-item span="0:3 600:2">
      <n-card>
        <n-space style="flex-direction: column">
          <div>
            <n-h3 style="margin-bottom: 0">我的应用</n-h3>
            <n-divider></n-divider>
            <n-button type="primary">创建</n-button>
            <n-divider></n-divider>
            <n-spin :show="applicationListLoading">
              <n-empty v-if="applicationList.length === 0"></n-empty>
              <n-grid v-else>
                <n-grid-item></n-grid-item>
              </n-grid>
            </n-spin>
          </div>
        </n-space>
      </n-card>
    </n-grid-item>
    <!-- 权限列表 -->
    <n-grid-item span="0:3 600:1">
      <n-list style="margin: 0" bordered>
        <template #header>
          <n-h3 style="margin-bottom: 0">权限节点列表</n-h3>
        </template>
        <n-spin :show="permissionListLoading">
          <n-scrollbar style="height: 75vh">
            <n-list-item v-for="permission in permissionList">
              <n-thing>
                <n-text>{{ permission.node }}</n-text>
                <n-text style="margin-left: 1.5rem; float: right">
                  {{ permission.description ?? '无描述' }}
                </n-text>
              </n-thing>
            </n-list-item>
          </n-scrollbar>
        </n-spin>
      </n-list>
    </n-grid-item>
  </n-grid>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import userData from '@/utils/stores/userData/store'
import Message from '@/utils/message'
import api from '@/api'
import logger from '@/utils/logger'

const message = new Message()

const permissionList = ref([])
const permissionListLoading = ref(true)

const applicationList = ref([])
const applicationListLoading = ref(true)

onMounted(async () => {
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
      permissionList.value = rs.data.list
      return true
    } else {
      message.error(rs.message)
    }
    return false
  }
  let init1 = await initPermissions()
  if (init1) {
    permissionListLoading.value = false
  }
})
</script>
