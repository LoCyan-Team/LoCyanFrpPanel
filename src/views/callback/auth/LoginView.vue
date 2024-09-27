<template>
  <div class="flex-center outbox" v-if="!error">
    <n-spin description="正在进行第三方登录处理"></n-spin>
  </div>
  <div class="flex-center outbox" v-else>
    <n-h2>发生错误</n-h2>
    <p>{{ error_message }}</p>
    <n-button style="margin-top: 10px" @click="() => router.push('/auth/login')">
      返回登录
    </n-button>
  </div>
</template>

<script setup>
import { sendErrorMessage } from '@/utils/message'
import { getUrlKey } from '@/utils/request'
import router from '@router'
import api from '@/api'

let error = ref(false)
let error_message = ref('')

const code = getUrlKey('code')

if (code !== null) {
  onMounted(async () => {
    let rs
    try {
      rs = await api.v2.auth.oauth.qq.login.post(code)
    } catch (e) {
      sendErrorMessage('登录失败: ' + e)
      error.value = true
      error_message.value = '请求服务器失败'
    }
    if (!rs) return
    if (rs.status === 200) {
      message.success(rs.data.username + '，欢迎回来！')
      userData.commit('set_token', rs.data.token)
      // console.log(rs.data)
      userData.commit('set_user_info', rs.data)
      router.push(redirect || '/dashboard')
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
