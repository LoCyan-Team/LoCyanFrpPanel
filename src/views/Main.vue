<template>
  <div style="text-align: center">
    <br/>
    <div class="sign">
      <span class="fast-flicker">Lo</span>Cyan<span class="flicker">Frp</span>
    </div>
    <n-alert type="default" style="font-size: 20px; display: inline-block">一款真正完全免费的内网穿透软件！
    </n-alert>
    <br/><br/>
    <n-button-group>
      <n-space :x-gap="5">
        <n-button
            size="large"
            strong secondary type="primary"
            @click="router.push({ name: 'Login' })"
        >
        <template #icon>
        <n-icon>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm-3.6 13.9l1-4.4l2.1 2v6h2v-7.5l-2.1-2l.6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1c-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7l-1.6 8.1l-4.9-1l-.4 2l7 1.4z" fill="currentColor"></path></svg>
        </n-icon>
      </template>
        进入
        </n-button
        >
        <n-button size="large" @click="GoToDocs">文档</n-button>
      </n-space>
    </n-button-group>
  </div>
</template>

<script setup>
import router from "../router/index.js";

const GoToDocs = () => {
  window.open("https://doc.locyan.cn");
};
</script>

<style scoped>
body{background-color:#141114;background-image:linear-gradient(335deg,black 23px,transparent 23px),linear-gradient(155deg,black 23px,transparent 23px),linear-gradient(335deg,black 23px,transparent 23px),linear-gradient(155deg,black 23px,transparent 23px);background-size:58px 58px;background-position:0px 2px,4px 35px,29px 31px,34px 6px;}.sign{position:absolute;display:flex;justify-content:center;align-items:center;width:50%;height:50%;transform:translate(-50%,-50%);letter-spacing:normal;left:50%;top:50%;text-transform:uppercase;font-size:6ex;color:#ffe6ff;text-shadow:0 0 0.6rem #ffe6ff,0 0 1.5rem #73e825e1,-0.2rem 0.1rem 1rem #73e825e1,0.2rem 0.1rem 1rem #73e825e1,0 -0.5rem 2rem #12d00f,0 0.5rem 3rem #12d00f;animation:shine 2s forwards,flicker 3s infinite;}@keyframes blink{0%,22%,36%,75%{color:#ffe6ff;text-shadow:0 0 0.6rem #ffe6ff,0 0 1.5rem #73e825e1,-0.2rem 0.1rem 1rem #73e825e1,0.2rem 0.1rem 1rem #73e825e1,0 -0.5rem 2rem #12d00f,0 0.5rem 3rem #12d00f;}28%,33%{color:#73e825e1;text-shadow:none;}82%,97%{color:#12d00f;text-shadow:none;}}.flicker{animation:shine 2s forwards,blink 3s 2s infinite;}.fast-flicker{animation:shine 2s forwards,blink 10s 1s infinite;}@keyframes shine{0%{color:#29ac6a;text-shadow:none;}100%{color:#ffe6ff;text-shadow:0 0 0.6rem #ffe6ff,0 0 1.5rem #73e825e1,-0.2rem 0.1rem 1rem #73e825e1,0.2rem 0.1rem 1rem #73e825e1,0 -0.5rem 2rem #12d00f,0 0.5rem 3rem #12d00f;}}@keyframes flicker{from{opacity:1;}4%{opacity:0.9;}6%{opacity:0.85;}8%{opacity:0.95;}10%{opacity:0.9;}11%{opacity:0.922;}12%{opacity:0.9;}14%{opacity:0.95;}16%{opacity:0.98;}17%{opacity:0.9;}19%{opacity:0.93;}20%{opacity:0.99;}24%{opacity:1;}26%{opacity:0.94;}28%{opacity:0.98;}37%{opacity:0.93;}38%{opacity:0.5;}39%{opacity:0.96;}42%{opacity:1;}44%{opacity:0.97;}46%{opacity:0.94;}56%{opacity:0.9;}58%{opacity:0.9;}60%{opacity:0.99;}68%{opacity:1;}70%{opacity:0.9;}72%{opacity:0.95;}93%{opacity:0.93;}95%{opacity:0.95;}97%{opacity:0.93;}to{opacity:1;}}
</style>
