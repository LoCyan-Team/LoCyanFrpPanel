<template>
  <div class="flex-center outbox">
    <n-h2>404 :&lpar;</n-h2>
    <p>我们没有找到你请求的页面，似乎你来到了没有任何东西的地方..?</p>
    <n-button
      style="margin-top: 10px"
      @click="
        () => {
          if (userData.getters.get_token !== '') router.push({ name: 'Dashboard' })
          else router.push('/')
        }
      "
    >
      带我去首页
    </n-button>
  </div>
</template>

<script setup lang="ts">
import userData from '@/utils/stores/userData/store'
import { useRouter } from 'vue-router'

const router = useRouter()
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
