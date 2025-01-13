<template>
  <div class="flex-center outbox" v-if="!error">
    <n-spin description="正在进行第三方登录处理"></n-spin>>
    <p>请不要关闭此界面</p>
  </div>
  <div class="flex-center outbox" v-else>
    <n-h2>发生错误</n-h2>
    <p>{{ errorMessage }}</p>
    <n-button style="margin-top: 10px" @click="() => router.push({ name: 'Login' })">
      返回登录
    </n-button>
  </div>
</template>

<script setup>
import userData from '@/utils/stores/userData/store'
import { getUrlKey } from '@/utils/request'
import router from '@router'
import api from '@/api'
import Message from '@/utils/message'
import Notification from '@/utils/notification'

const message = new Message()
const notification = new Notification()

let error = ref(false)
let errorMessage = ref('')

const code = getUrlKey('code')

if (code !== null) {
  onMounted(async () => {
    let rs
    try {
      rs = await api.v2.auth.oauth.qq.login.post(code)
    } catch (e) {
      message.error('登录失败: ' + e)
      error.value = true
      errorMessage.value = '请求服务器失败'
    }
    if (!rs) return
    if (rs.status === 200) {
      userData.commit('set_token', rs.data.token)
      userData.commit('set_user_info', rs.data)
      userData.commit('set_frp_token', rs.data.frp_token)
      notification.success('登录成功', rs.data.username + '，欢迎回来！')
      router.push(redirect || '/dashboard')
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
