<script setup>
import router from '@router'
import userData from '@/utils/stores/userData/store'
</script>

<template>
  <div class="flex-center outbox">
    <h2>404 :&lpar;</h2>
    <p>我们没有找到你请求的页面，似乎你来到了没有任何东西的地方..?</p>
    <n-button
      style="margin-top: 10px"
      @click="
        () => {
          if (userData.getters.get_token != '') router.push('/dashboard')
          else router.push('/')
        }
      "
    >
      带我去首页
    </n-button>
  </div>
</template>

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
