<template>
  <div class="flex-center outbox" v-if="!error">
    <n-spin description="正在处理" v-if="!success"></n-spin>
    <div class="flex-center" v-else>
      <n-h2>实人认证成功</n-h2>
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
import API from '@/api'
import userData from '@/utils/stores/userData/store'

const api = new API()
const message = new Message()

let error = ref(false)
let success = ref(false)
let errorMessage = ref('')

const userId = userData.getters.get_user_id

onMounted(async () => {
  let rs
  try {
    rs = await api.v2.verification.realperson.get({
      userId: userId
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
