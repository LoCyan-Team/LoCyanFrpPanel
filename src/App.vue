<template>
  <n-config-provider :hljs="hljs" :theme="theme">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <message />
            <loadingbar />
            <ndialog />
            <Notification />
            <MainNav v-if="store.getters.get_token" />
            <GuestNav v-else />
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup>
import {
  darkTheme,
  lightTheme,
  NConfigProvider,
  NDialogProvider,
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
  useOsTheme,
} from "naive-ui";
import MainNav from "./components/MainNav.vue";
import GuestNav from "./components/GuestNav.vue";
import Notification from "./components/Notification.vue";
import { computed } from "vue";
import store from "./utils/stores/store.js";
import hljs from "highlight.js/lib/core";
import ini from "highlight.js/lib/languages/ini";
import nginx from "highlight.js/lib/languages/nginx";
import { get } from "./utils/request.js";
import { sendWarningMessage } from "./utils/message.js";
import { logout } from "./utils/profile.js";
// import { init_ws, SetOnMessageFunction } from "./utils/websocket.js";
import { sendInfoNotification } from "./utils/notification.js";

const osThemeRef = useOsTheme();
const theme = computed(() => (osThemeRef.value === "dark" ? darkTheme : null));
let inited = false;

hljs.registerLanguage("ini", ini);
hljs.registerLanguage("nginx", nginx);

function getMessage(e) {
  const rs = JSON.parse(e.data);
  // 通知
  if (rs.type === "notice") {
    sendInfoNotification(rs.message);
  }
}

// 初始化websocket
if (inited === false) {
  // init_ws();
  // SetOnMessageFunction(getMessage);
  inited = true;
}

setInterval(() => {
  if (store.getters.get_token) {
    const rs = get(
      "https://api.locyanfrp.cn/Account/info?username=" +
      store.getters.get_username +
      "&token=" +
      store.getters.get_token,
      []
    );
    rs.then((res) => {
      if (res.status === 0) {
        localStorage.setItem("proxies", res.proxies_num);
        localStorage.setItem("traffic", res.traffic);
        localStorage.setItem("set_limit", res);
      }
      if (res.status === -3) {
        sendWarningMessage("登录过期或未登录，请重新登录后台！");
        logout();
      }
    });
  }
}, 10000);
</script>
