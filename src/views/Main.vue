<template>
  <div style="text-align: center;">
    <br />
    <n-h1>LoCyanFrp</n-h1>
    <n-text>一款真正完全免费的内网穿透软件！</n-text>
    <br />
    <br />
    <n-button-group>
      <n-button @click="router.push({name: 'login'})">进入LCF</n-button>
      <n-button @click="GoToDocs">文档</n-button>
    </n-button-group>
  </div>
</template>

<script setup>

import { NH1, NText, NButton, NButtonGroup } from "naive-ui";
import router from "../router/index.js";

const GoToDocs = () => {
  window.open("https://doc.locyan.cn")
}

</script>

<style scoped>

</style>