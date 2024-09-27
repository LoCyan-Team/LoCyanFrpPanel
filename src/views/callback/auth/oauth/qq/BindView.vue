<template>
  <div class="flex-center outbox" v-if="!error">
    <n-spin description="正在处理" v-if="!success"></n-spin>
    <div class="flex-center" v-else>
      <n-h2>绑定成功</n-h2>
      <p>可以关闭此界面</p>
    </div>
  </div>
  <div class="flex-center outbox" v-else>
    <n-h2>发生错误</n-h2>
    <p>{{ error_message }}</p>
  </div>
</template>

<script setup>
import { sendErrorMessage } from '@/utils/message.js'
import { getUrlKey } from '@/utils/request.js'
import api from '@/api/index.js'
import userData from '@/utils/stores/userData/store'

let error = ref(false)
let success = ref(false)
let error_message = ref('')

const username = userData.getters.get_username

if (username == null) {
  error.value = true
  error_message.value = '需要登录才能继续操作'
}

const code = getUrlKey('code')

if (!error.value && code !== null) {
  onMounted(async () => {
    let rs
    try {
      rs = await api.v2.auth.oauth.qq.bind.post(username, code)
    } catch (e) {
      sendErrorMessage('登录失败: ' + e)
      error.value = true
      error_message.value = '请求服务器失败'
    }
    if (!rs) return
    if (rs.status === 200) {
      message.success('绑定成功')
      success.value = true
    } else {
      error.value = true
      error_message.value = rs.message
    }
  })
} else {
  error.value = true
  error_message.value = '缺少返回参数'
}
</script>

<style scoped>
.outbox {
  margin: 3rem;
  margin-block: 40vh;
}
.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
