<template>
  <n-config-provider :hljs="hljs" :theme="theme">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <message />
          <loadingbar />
          <ndialog />
          <MainNav v-if="store.getters.GetToken" />
          <GuestNav v-else/>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
  <!-- 气死我了zhoudexuan，让我一个写后端的来搓前端，mmp -->
  <!-- 中考完学不会vue你就死定了 -->
  <!-- 怨气好重··· - 爱来自LiteCat-->
</template>

<script setup>
import {  NMessageProvider, NConfigProvider, darkTheme, NDialogProvider, useOsTheme } from "naive-ui";
import MainNav from "./components/MainNav.vue";
import GuestNav from "./components/GuestNav.vue";
import { computed } from "vue";
import { NLoadingBarProvider } from "naive-ui";
import store from "./utils/stores/store.js";
import hljs from 'highlight.js/lib/core';
import ini from 'highlight.js/lib/languages/ini';
import nginx from 'highlight.js/lib/languages/nginx'
import { get } from "./utils/request.js";
import { SendWarningMessage } from "./utils/message.js";
import { Logout } from "./utils/profile.js";
// import { init_ws, SetOnMessageFunction } from "./utils/websocket.js";

const osThemeRef = useOsTheme();
const theme = computed(() => osThemeRef.value === "dark" ? darkTheme : null);
// let inited = false;

hljs.registerLanguage('ini', ini);
hljs.registerLanguage('nginx', nginx);

function getMessage(e){
  console.log(e.data);
}

setInterval(() => {
  if (store.getters.GetToken) {
    const rs = get("https://api.locyanfrp.cn/Account/info?username=" + store.getters.GetUserName + "&token=" + store.getters.GetToken, [])
    rs.then(res=> {
      if(res.status === 0){
        localStorage.setItem("proxies", res.proxies_num);
        localStorage.setItem("traffic", res.traffic);
        store.commit("setLimit", res);
      }
      if (res.status === -3){
        SendWarningMessage("登录过期或未登录，请使用LCF账户登录后台！");
        Logout();
      }
    });

    // 初始化websocket
    // if (inited === false) {
    //   init_ws();
    //   SetOnMessageFunction(getMessage);
    //   inited = true
    // }

  }
}, 10000);
</script>