<template>
  <div class="flex-center outbox" v-if="!error">
    <!-- <n-spin description="正在进行第三方登录处理"></n-spin> -->
  </div>
  <div class="flex-center outbox" v-else>
    <!-- <n-h2>发生错误</n-h2>
    <p>{{ error_message }}</p>
    <n-button style="margin-top: 10px" @click="() => router.push('/auth/login')">
      返回登录
    </n-button> -->
  </div>
</template>

<script setup>
let error = ref(false)
let error_message = ref('')
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
