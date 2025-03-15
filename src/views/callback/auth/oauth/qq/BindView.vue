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
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import Message from '@/utils/message'
import { getUrlKey } from '@/utils/request'
import API from '@/api'
import userData from '@/utils/stores/userData/store'

const api = new API()
const message = new Message()

let error = ref(false)
let success = ref(false)
let errorMessage = ref('')

const userId = userData.getters.get_user_id

const code = getUrlKey('code')

if (code !== null) {
  onMounted(async () => {
    let rs
    try {
      rs = await api.v2.auth.oauth.qq.bind.post({
        userId: userId,
        code: code
      })
    } catch (e) {
      message.error('登录失败: ' + e)
      error.value = true
      errorMessage.value = '请求服务器失败'
    }
    if (!rs) return
    if (rs.status === 200) {
      success.value = true
    } else {
      error.value = true
      errorMessage.value = rs.message
    }
  })
} else {
  error.value = true
  errorMessage.value = '缺少返回参数'
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
