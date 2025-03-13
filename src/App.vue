<template>
  <n-config-provider :hljs="hljs" :theme="theme">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <the-message />
            <loading-bar />
            <the-dialog />
            <the-notification />
            <n-layout style="height: 100%" v-show="loading">
              <n-el class="load-container">
                <n-spin></n-spin>
              </n-el>
            </n-layout>
            <n-layout style="height: 100%" v-show="!loading">
              <n-layout-header :inverted="false" bordered>
                <the-header />
              </n-layout-header>
              <n-layout has-sider style="height: calc(100dvh - 65px); bottom: 0">
                <div class="sidebar-container">
                  <guest-sidebar v-if="showGuestSidebar" />
                  <main-sidebar v-if="showMainSidebar" />
                </div>
                <n-layout-content
                  :class="sidebarContentClass"
                  class="content-container"
                  :native-scrollbar="false"
                >
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
                </n-layout-content>
              </n-layout>
            </n-layout>
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style scoped>
@media screen and (max-width: 650px) {
  .sidebar-container {
    position: absolute;
    height: 100%;
    z-index: 2;
  }
  .content-container.sidebar {
    margin-left: 64px;
  }
  .content-container.no-sidebar {
    margin-left: 0;
  }
}
</style>

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
import TheNotification from '@components/TheNotification.vue'
import TheFooter from '@components/TheFooter.vue'
import TheHeader from '@components/TheHeader.vue'
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
import Notification from '@/utils/notification'
import { logout } from '@/utils/profile'
import router from '@router'
import { useRoute, useRouter } from 'vue-router'

const notification = new Notification()

// 手机状态下收缩菜单栏
const collapsed = ref(true)
if (document.body.clientWidth >= 1000) {
  collapsed.value = false
}

const osThemeRef = useOsTheme()
const route = useRoute()
const vRouter = useRouter()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : null))
// let initFinished = false

const loading = ref(true)
const tokenValid = ref(false)
const showGuestSidebar = ref(false)
const showMainSidebar = ref(false)
const sidebarContentClass = computed(() =>
  showGuestSidebar.value === false && showMainSidebar.value === false ? 'no-sidebar' : 'sidebar'
)

hljs.registerLanguage('ini', ini)
hljs.registerLanguage('nginx', nginx)

vRouter.afterEach(() => {
  contentRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
})

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

let reconnecting = false
let connectionLostInstance

async function fetchUserInfo() {
  let rs
  try {
    rs = await api.v2.user.info.root.get(userData.getters.get_user_id)
  } catch (e) {
    reconnecting = true
    if (connectionLostInstance === undefined) {
      connectionLostInstance = window.$notification.create({
        title: '连接已断开',
        content: '正在重新连接...',
        closable: false
      })
    }
    return false
  }
  if (!rs) return false
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
    notification.warning('授权失效', '请重新登录后台！')
    logout()
    router.push({
      name: 'Login',
      query: {
        redirect: encodeURIComponent(window.location.pathname + window.location.search)
      }
    })
  }
  return false
}

watch(
  () => route.meta,
  (value) => {
    if (value.noSidebar) {
      showMainSidebar.value = false
      showGuestSidebar.value = false
      return
    }
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
    // 有效
    // connectionLostInstance 已订阅
    if (valid && connectionLostInstance !== undefined) {
      connectionLostInstance.destroy()
      // 重置对象
      connectionLostInstance = undefined
      reconnecting = false
    }
    // 无效
    // 未重连
    if (!valid && !reconnecting) {
      logout()
      router.push({
        name: 'Login',
        query: {
          redirect: encodeURIComponent(window.location.pathname + window.location.search)
        }
      })
    }
  }
}, 10000)
</script>

<style>
.n-config-provider {
  height: 100dvh;
}

.load-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.content {
  margin-right: 15px;
  margin-left: 15px;
  min-height: calc(100dvh - 64px);
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
