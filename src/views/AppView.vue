<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-package"></i>
    <n-text type="primary"> OAuth2.0 应用</n-text>
  </n-h1>
  <n-modal
    preset="card"
    style="max-width: 600px"
    size="huge"
    title="新建应用"
    v-model:show="showCreateModal"
    :bordered="false"
    :segmented="modalSegmented"
  >
    <n-form>
      <n-form-item label="应用名称">
        <n-input v-model:value="creatingData.name"></n-input>
      </n-form-item>
      <n-form-item label="介绍">
        <n-input v-model:value="creatingData.description"></n-input>
      </n-form-item>
      <n-form-item label="重定向 URL">
        <n-input v-model:value="creatingData.redirectUrl"></n-input>
      </n-form-item>
    </n-form>
    <template #footer>
      <n-button @click="createApplication" type="primary" secondary>提交</n-button>
    </template>
  </n-modal>
  <n-modal
    preset="card"
    style="max-width: 600px"
    size="huge"
    :title="'编辑应用 - ID: ' + modifyingData.id"
    v-model:show="showModifyModal"
    :bordered="false"
    :segmented="modalSegmented"
  >
    <n-form>
      <n-form-item label="应用名称">
        <n-input v-model:value="modifyingData.name"></n-input>
      </n-form-item>
      <n-form-item label="介绍">
        <n-input v-model:value="modifyingData.description"></n-input>
      </n-form-item>
      <n-form-item label="重定向 URL">
        <n-input v-model:value="modifyingData.redirectUrl"></n-input>
      </n-form-item>
    </n-form>
    <template #footer>
      <n-button @click="modifyApplication" type="primary" secondary>提交</n-button>
    </template>
  </n-modal>
  <n-grid :y-gap="3" :x-gap="20" cols="3" item-responsive>
    <n-grid-item span="0:3 600:2">
      <n-card>
        <n-space style="flex-direction: column">
          <div>
            <n-h3>我的应用</n-h3>
            <n-button @click="createModal" type="primary">创建</n-button>
            <n-divider></n-divider>
            <n-spin :show="applicationListLoading">
              <n-empty v-if="applicationList.length === 0"></n-empty>
              <n-card v-for="app in applicationList">
                <template #header>
                  <n-h3 style="margin-bottom: 0">
                    {{ app.name }}
                    <n-tag :bordered="false" type="success" style="transform: translateY(-2px)">
                      ID: {{ app.id }}
                    </n-tag>
                  </n-h3>
                </template>
                <n-text
                  >介绍: {{ app.description === '' ? '无' : (app.description ?? '无') }}</n-text
                ><br />
                <n-text>重定向地址: {{ app.redirect_url }}</n-text>
                <template #action>
                  <n-space>
                    <n-button @click="modifyModal(app.id)" type="primary" secondary>修改</n-button>
                    <n-button @click="deleteApplication(app.id)" type="error" secondary
                      >删除</n-button
                    >
                  </n-space>
                </template>
              </n-card>
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
import Dialog from '@/utils/dialog'
import api from '@/api'
import logger from '@/utils/logger'

const message = new Message()
const dialog = new Dialog()

const permissionList = ref([])
const permissionListLoading = ref(true)

const applicationList = ref([])
const applicationListLoading = ref(true)

const showCreateModal = ref(false)
const showModifyModal = ref(false)
let creatingData = ref({
  name: '',
  description: null,
  redirectUrl: ''
})
let modifyingData = ref({
  id: 0,
  name: '',
  description: null,
  redirectUrl: ''
})
const modalSegmented = {
  content: 'soft',
  footer: 'soft'
}

function createModal() {
  showCreateModal.value = true
}
async function createApplication() {
  let rs
  try {
    rs = await api.v2.app.root.post(
      userData.getters.get_user_id,
      creatingData.value.name,
      creatingData.value.description,
      creatingData.value.redirectUrl
    )
  } catch (e) {
    logger.error(e)
    message.error(e)
  }
  if (!rs) return
  if (rs.status === 200) {
    dialog.success('创建成功')
    reloadApplications()
    showCreateModal.value = false
  } else {
    message.error(rs.status)
  }
}

function modifyModal(id: number) {
  showModifyModal.value = true
  modifyingData.value.id = id
  const data = applicationList.value.filter((item) => item.id === id)[0]
  modifyingData.value.name = data.name
  modifyingData.value.description = data.description
  modifyingData.value.redirectUrl = data.redirect_url
}
async function modifyApplication() {
  let rs
  try {
    rs = await api.v2.app.update(
      userData.getters.get_user_id,
      modifyingData.value.id,
      modifyingData.value.name,
      modifyingData.value.description,
      modifyingData.value.redirectUrl
    )
  } catch (e) {
    logger.error(e)
    message.error(e)
  }
  if (!rs) return
  if (rs.status === 200) {
    dialog.success('修改成功')
    reloadApplications()
    showModifyModal.value = false
  } else {
    message.error(rs.status)
  }
}

async function deleteApplication(id: number) {
  dialog.warning('确认要删除这个应用吗？此操作不可逆', {
    onPositiveClick: async () => {
      let rs
      try {
        rs = await api.v2.app.root.delete(userData.getters.get_user_id, id)
      } catch (e) {
        logger.error(e)
        message.error(e)
      }
      if (!rs) return
      if (rs.status === 200) {
        message.success('删除成功')
        applicationList.value = applicationList.value.filter((item) => item.id !== id)
      } else {
        message.error(rs.message)
      }
    }
  })
}

async function reloadApplications() {
  applicationListLoading.value = true
  const reload = await initApplications()
  if (!reload) message.warning('刷新应用列表失败')
  applicationListLoading.value = false
}

async function initApplications(): Promise<boolean> {
  let rs
  try {
    rs = await api.v2.app.all(userData.getters.get_user_id)
  } catch (e) {
    logger.error(e)
    message.error(e)
    return false
  }
  if (!rs) return false
  if (rs.status === 200) {
    applicationList.value = rs.data.list
    return true
  } else {
    message.error(rs.message)
  }
  return false
}

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
  let init2 = await initApplications()
  if (init1) {
    permissionListLoading.value = false
  }
  if (init2) {
    applicationListLoading.value = false
  }
})
</script>
