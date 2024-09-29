<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-page-facing-up"></i>
    <n-text type="primary"> 域名白名单</n-text>
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
        <n-card>
          <n-form-item label="域名" path="domain">
            <n-input v-model:value="domainInput.domain" placeholder="example.com" />
          </n-form-item>
          <div style="display: flex; justify-content: flex-start">
            <n-button type="primary" @click="submit"> 创建</n-button>
          </div>
        </n-card>
      </n-grid-item>
      <n-grid-item span="1">
        <n-list bordered v-show="showList">
          <template #header> 已登记的域名 </template>
          <n-list-item v-for="item in icpList">
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
      </n-grid-item>
    </n-grid>
  </n-form>
</template>
<script setup>
import { ref } from 'vue'
import userData from '@/utils/stores/userData/store'
import { sendSuccessMessage, sendErrorMessage } from '@/utils/message'
import { sendErrorDialog, sendSuccessDialog } from '@/utils/dialog'
import { useDialog } from 'naive-ui'
import api from '@/api'

const showList = ref(false)
const formRef = ref(null)
const dialog = useDialog()
const loading = ref(false)
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
  if (loading.value == true) {
    return
  }
  loading.value = true
  if (domainInput.value.domain === '' || domainInput.value.domain === null) {
    sendErrorDialog('域名不得为空！')
    loading.value = false
    return
  }
  let rs
  try {
    rs = await api.v2.icp.post(userData.getters.get_username, domainInput.value.domain)
  } catch (e) {
    sendErrorMessage('请求审核失败: ' + e)
  }
  loading.value = false
  if (!rs) return
  if (rs.status != 200) {
    loading.value = false
    sendErrorDialog('审核失败，可能是域名没有备案或格式错误！')
  } else {
    getList()
    loading.value = false
    sendSuccessDialog('添加成功！')
  }
}

async function removeICP(id) {
  dialog.warning({
    title: '警告',
    content: '你确定要删除这个域名吗？（域名 ID: ' + id + '）',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      let rs
      try {
        rs = await api.v2.icp.delete(userData.getters.get_username, id)
      } catch (e) {
        sendErrorMessage('请求移除域名失败: ' + e)
      }
      if (!rs) return
      if (rs.status === 200) {
        sendSuccessDialog('删除成功！')
        getList()
      } else {
        sendErrorDialog('删除失败，请联系管理员处理！')
      }
    },
    onNegativeClick: () => {
      sendSuccessMessage('你取消了操作！')
    },
    onMaskClick: () => {
      sendSuccessMessage('你取消了操作！')
    }
  })
}

async function getList() {
  let rs
  try {
    rs = await api.v2.icp.get(userData.getters.get_username)
  } catch (e) {
    sendErrorMessage('请求移除域名失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    icpList.value = rs.data.list
    showList.value = true
  } else {
    showList.value = false
  }
}

getList()
</script>
