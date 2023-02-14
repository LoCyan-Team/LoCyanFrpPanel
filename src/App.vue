<template>
  <n-config-provider :hljs="hljs" :theme="theme">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <message />
          <loadingbar />
          <ndialog />
          <MainNav v-if="store.getters.GetToken" />
          <GuestNav v-else="store.getters.GetToken"/>
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
import { h, ref, computed } from "vue";
import { NLoadingBarProvider } from "naive-ui";
import { Logout, GetLoginStatus } from "./utils/profile.js";
import { SendSuccessMessage } from "./utils/message.js";
import store from "./utils/store.js";
import hljs from 'highlight.js/lib/core';
import ini from 'highlight.js/lib/languages/ini';
import nginx from 'highlight.js/lib/languages/nginx'

const osThemeRef = useOsTheme();
const theme = computed(() => osThemeRef.value === "dark" ? darkTheme : null);

hljs.registerLanguage('ini', ini);
hljs.registerLanguage('nginx', nginx);

if (store.getters.GetToken) {
  GetLoginStatus(store.getters.GetUserName, store.getters.GetToken);
}
</script>