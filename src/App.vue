<template>
  <n-config-provider :hljs="hljs" :theme="theme">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <the-message />
            <loading-bar />
            <the-dialog />
            <notification />
            <div v-if="loading" class="load-container">
              <n-spin></n-spin>
            </div>
            <n-layout>
              <user-info />
              <n-layout-header :inverted="false" bordered>
                <the-header />
              </n-layout-header>
              <n-layout has-sider style="height: calc(100vh - 66px); bottom: 0">
                <transition name="fade" mode="out-in" :duration="400">
                  <div :key="router.currentRoute.value.name">
                    <guest-sidebar v-if="showGuestSidebar" />
                    <main-sidebar v-if="showMainSidebar" />
                  </div>
                </transition>
                <n-layout :native-scrollbar="false">
                  <div class="content">
                    <router-view v-slot="{ Component }">
                      <keep-alive :max="10">
                        <transition name="fade" mode="out-in" :duration="400">
                          <div :key="router.currentRoute.value.name">
                            <component :is="Component" />
                          </div>
                        </transition>
                      </keep-alive>
                    </router-view>
                  </div>
                  <n-divider />
                  <the-footer />
                </n-layout>
              </n-layout>
            </n-layout>
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup>
import {
  darkTheme,
  NConfigProvider,
  NDialogProvider,
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
  useOsTheme
} from 'naive-ui'
import Notification from '@components/TheNotification.vue'
import TheFooter from '@components/TheFooter.vue'
import TheHeader from '@components/TheHeader.vue'
import UserInfo from '@components/UserInfo.vue'
import MainSidebar from '@components/sidebar/MainSidebar.vue'
import GuestSidebar from '@components/sidebar/GuestSidebar.vue'
import LoadingBar from '@components/LoadingBar.vue'
import TheMessage from '@components/TheMessage.vue'
import TheDialog from '@components/TheDialog.vue'

import { computed, ref } from 'vue'
import userData from '@/utils/stores/userData/store'
import hljs from 'highlight.js/lib/core'
import ini from 'highlight.js/lib/languages/ini'
import nginx from 'highlight.js/lib/languages/nginx'
import api from '@/api'
import { sendWarningMessage } from '@/utils/message'
import { logout } from '@/utils/profile'
import router from '@router'
import { useRoute } from 'vue-router'

// 手机状态下收缩菜单栏
const collapsed = ref(true)
if (document.body.clientWidth >= 1000) {
  collapsed.value = false
}

const osThemeRef = useOsTheme()
const route = useRoute()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : null))
// let initFinished = false

const loading = ref(true)
const tokenValid = ref(false)
const showGuestSidebar = ref(false)
const showMainSidebar = ref(false)

hljs.registerLanguage('ini', ini)
hljs.registerLanguage('nginx', nginx)

// function getMessage(e) {
//   const rs = JSON.parse(e.data)
//   // 通知
//   if (rs.type === 'notice') {
//     sendInfoNotification(rs.message)
//   }
// }

// 初始化websocket
// if (initFinished === false) {
//   // init_ws();
//   // SetOnMessageFunction(getMessage);
//   initFinished = true
// }

async function fetchUserInfo() {
  let rs
  try {
    rs = await api.v2.user.info.root.get(userData.getters.get_username)
  } catch (e) {
    sendWarningMessage('查询用户信息失败: ' + e + '，请重新登录后台！')
  }
  if (!rs) return
  if (rs.status === 200) {
    // console.log(rs)
    userData.commit('set_user_email', rs.data.email)
    userData.commit('set_user_inbound', rs.data.inbound)
    userData.commit('set_user_outbound', rs.data.inbound)
    userData.commit('set_user_traffic', rs.data.traffic)
    // localStorage.setItem('proxies', res.proxies_num)
    // localStorage.setItem('traffic', res.traffic)
    // localStorage.setItem('set_limit', res)
    // userData.set_limit({
    //   inbound: res.inbound,
    //   outbound: res.outbound,
    // })
    return true
  }
  if (rs.status === 401) {
    sendWarningMessage('登录过期或未登录，请重新登录后台！')
    logout()
  }
  return false
}

watch(
  () => route.meta,
  (value) => {
    if (value.needLogin) {
      showMainSidebar.value = true
      showGuestSidebar.value = false
    } else {
      if (value.sidebar?.guest) {
        showMainSidebar.value = false
        showGuestSidebar.value = true
      } else if (value.sidebar?.main) {
        showMainSidebar.value = true
        showGuestSidebar.value = false
      } else {
        showMainSidebar.value = false
        showGuestSidebar.value = false
      }
    }
  }
)

onMounted(async () => {
  if (userData.getters.get_token !== '') {
    tokenValid.value = await fetchUserInfo()
  }
  loading.value = false
})

setInterval(async () => {
  if (userData.getters.get_token !== '') {
    const valid = await fetchUserInfo()
    if (!valid) {
      router.push('/auth/login')
    }
  }
}, 10000)
</script>

<style>
.load-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  margin-right: 15px;
  margin-left: 15px;
  min-height: calc(100vh - 115px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
