<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-page-facing-up"></i>
    <n-text type="success"> 域名白名单</n-text>
  </n-h1>

  <n-alert title="说明" type="info">
    1.
    使用国内节点建站需要使用备案域名，我站为了防止非备案域名非法解析国内节点造成损失，现启用域名白名单；<br />
    2. 域名需在中华人民共和国工业和信息化部完成并通过备案，随后将顶级域名填入下方编辑框中提交即可。
  </n-alert>
  <br />

  <n-form :ref="formRef" :model="domainInput" label-width="auto" size="large">
    <n-grid y-gap="12" cols="1" item-responsive>
      <n-grid-item span="1">
        <n-card title="提交域名">
          <n-form-item label="域名" path="domain">
            <n-input v-model:value="domainInput.domain" placeholder="example.com" />
          </n-form-item>
          <div style="display: flex; justify-content: flex-start">
            <n-button type="success" @click="submit" :loading="loading" :disabled="loading"> 创建</n-button>
          </div>
        </n-card>
      </n-grid-item>
      <n-grid-item span="1">
        <n-h3> 已登记的域名 </n-h3>
        <n-spin :show="icpListLoading">
          <n-empty v-if="icpList.length === 0"></n-empty>
          <n-list v-else bordered v-show="showList">
            <n-list-item v-for="item in icpList" v-bind:key="item.id">
              <n-thing
                :title="item.domain"
                :description="item.unit_name + ' (' + item.nature_name + ') - ' + item.icp"
              >
              </n-thing>
              <template #suffix>
                <n-button type="error" @click="removeICP(item.id)">删除</n-button>
              </template>
            </n-list-item>
          </n-list>
        </n-spin>
      </n-grid-item>
    </n-grid>
  </n-form>
</template>

<script setup>
import { ref } from 'vue'
import userData from '@/utils/stores/userData/store'
import Message from '@/utils/message'
import Dialog from '@/utils/dialog'
import logger from '@/utils/logger'
import API from '@/api'

const api = new API()
const message = new Message()
const dialog = new Dialog()

const showList = ref(false)
const formRef = ref(null)
const loading = ref(false)
const icpListLoading = ref(true)
const domainInput = ref({
  domain: ''
})
const icpList = ref([
  {
    id: 0,
    icp: '',
    unitName: '',
    natureName: '',
    status: '',
    domain: '',
    username: ''
  }
])

async function submit() {
  if (loading.value === true) {
    return
  }
  loading.value = true
  if (domainInput.value.domain === '' || domainInput.value.domain === null) {
    message.error('域名不得为空！')
    loading.value = false
    return
  }
  let rs
  try {
    rs = await api.v2.icp.post({
      userId: userData.getters.get_user_id,
      domain: domainInput.value.domain
    })
  } catch (e) {
    logger.error(e)
    dialog.error('请求审核失败: ' + e)
  }
  loading.value = false
  if (!rs) return
  if (rs.status !== 200) {
    loading.value = false
    dialog.error('审核失败: ' + rs.message)
  } else {
    getList()
    loading.value = false
    dialog.success('添加成功！')
  }
}

async function removeICP(id) {
  dialog.warning('你确定要删除这个域名吗？（域名 ID: ' + id + '）', {
    onPositiveClick: async () => {
      let rs
      try {
        rs = await api.v2.icp.delete({
          userId: userData.getters.get_user_id,
          domainId: id
        })
      } catch (e) {
        logger.error(e)
        message.error('请求移除域名失败: ' + e)
      }
      if (!rs) return
      if (rs.status === 200) {
        message.success('删除成功！')
        await getList()
      } else {
        message.error('删除失败，请联系管理员处理！')
      }
    }
  })
}

async function getList() {
  icpListLoading.value = true
  let rs
  try {
    rs = await api.v2.icp.get({
      userId: userData.getters.get_user_id
    })
  } catch (e) {
    logger.error(e)
    message.error('请求移除域名失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    icpList.value = rs.data.list
    showList.value = true
  } else {
    showList.value = false
  }
  icpListLoading.value = false
}

getList()
</script>
