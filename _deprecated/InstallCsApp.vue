<template>
  <n-modal>
    <n-card
      style="width: 600px"
      title="软件下载"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space vertical>
        <n-spin :show="show">
          <div style="text-align: center">
            <n-alert title="已废弃" type="warning"> 请改用软件下载 </n-alert>
            文件名: {{ file_name }}
            <br />
            <br />
            下载链接: {{ down_link }}
            <br />
            <br />
            <n-button type="success" @click="startDownload()">点击下载</n-button>
          </div>
          <template #description> 正在获取下载地址 </template>
        </n-spin>
      </n-space>
    </n-card>
  </n-modal>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { sendErrorMessage } from '@/utils/message.js'
import api from '@/api/index.js'
import logger from '@/utils/logger.js'

const show = ref(true)
const file_name = ref('')
const down_link = ref('')

onMounted(async () => {
  let rs
  try {
    rs = await api.v1.App.GetCSApp()
  } catch (e) {
    logger.error(e)
    sendErrorMessage('获取下载链接失败: ' + e)
  }
  if (!rs) return
  down_link.value = rs.data.url
  file_name.value = rs.data.name
  show.value = false
})

function startDownload() {
  window.open(down_link.value)
}
</script>
