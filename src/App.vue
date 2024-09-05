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
  useOsTheme
} from 'naive-ui'
import MainNav from './components/MainNav.vue'
import GuestNav from './components/GuestNav.vue'
import Notification from './components/Notification.vue'
import { computed } from 'vue'
import store from './utils/stores/store.js'
import hljs from 'highlight.js/lib/core'
import ini from 'highlight.js/lib/languages/ini'
import nginx from 'highlight.js/lib/languages/nginx'
import api from '@/api'
import { sendWarningMessage, sendErrorMessage } from './utils/message.js'
import { logout } from './utils/profile.js'
// import { init_ws, SetOnMessageFunction } from "./utils/websocket.js";
import { sendInfoNotification } from './utils/notification.js'

const osThemeRef = useOsTheme()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : null))
let inited = false

hljs.registerLanguage('ini', ini)
hljs.registerLanguage('nginx', nginx)

function getMessage(e) {
  const rs = JSON.parse(e.data)
  // 通知
  if (rs.type === 'notice') {
    sendInfoNotification(rs.message)
  }
}

// 初始化websocket
if (inited === false) {
  // init_ws();
  // SetOnMessageFunction(getMessage);
  inited = true
}

setInterval(async () => {
  if (store.getters.get_token) {
    let rs
    try {
      rs = await api.users.info
    } catch (e) {
      sendWarningMessage('查询用户信息失败: ' + e + '，请重新登录后台！')
      logout()
    }
    if (!rs) return
    if (rs.status === 200) {
      // console.log(rs)
      store.commit('set_user_info', rs.data)
      // localStorage.setItem('proxies', res.proxies_num)
      // localStorage.setItem('traffic', res.traffic)
      // localStorage.setItem('set_limit', res)
      // store.set_limit({
      //   inbound: res.inbound,
      //   outbound: res.outbound,
      // })
    }
    if (rs.status === 401) {
      sendWarningMessage('登录过期或未登录，请重新登录后台！')
      logout()
    }
  }
}, 10000)
</script>
