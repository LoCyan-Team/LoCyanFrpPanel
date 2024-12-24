<template>
  <div class="flex-center outbox">
    <n-h2>您正在重定向到本地服务</n-h2>
    <n-text>如确认要进行此操作，请点击下方链接继续</n-text>
    <br />
    <a :href="finalUrl" style="max-width: 500px">
      <n-code :code="finalUrl" word-wrap />
    </a>
    <br />
    <n-text>如您不想继续此操作，您可以直接关闭此页面。</n-text>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getUrlKey } from '@/utils/request'

const urlKeys = {
  port: getUrlKey('port'),
  path: getUrlKey('path'),
  ssl: getUrlKey('ssl') === 'true',
  refreshToken: getUrlKey('refresh_token'),
  error: getUrlKey('error')
}

const finalUrl = ref(
  urlKeys.error != null
    ? `${urlKeys.ssl ? 'https' : 'http'}://localhost:${urlKeys.port}${urlKeys.path ?? ''}?error=${urlKeys.error}`
    : `${urlKeys.ssl ? 'https' : 'http'}://localhost:${urlKeys.port}${urlKeys.path ?? ''}?refresh_token=${urlKeys.refreshToken}`
)
</script>

<style scoped>
.outbox {
  margin: 3rem;
  margin-block: 35vh;
}
.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
