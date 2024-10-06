<template>
  <UserInfo />
  <n-space vertical>
    <n-layout style="height: 100vh">
      <n-layout-header :inverted="inverted" bordered>
        <n-space justify="space-between">
          <n-gradient-text
            :size="24"
            type="warning"
            style="margin-left: 20px; height: 50px; margin-top: 10%"
          >
            LoCyanFrp
          </n-gradient-text>
          <!-- 2023-04-30 23：04 by XiaMoHuaHuo_CN: 哪个大聪明在这放一言 -->
          <!--<n-p style="margin-top: 4%"><n-text style="font-size: 20px"> {{ hitokoto_content }} </n-text></n-p>-->
          <!-- 2024-1-27 10:43 by ltzXiaoYanMo 你问我我问谁啊，你去看commits记录啊（-->
          <n-space>
            <n-button
              circle
              style="margin-top: 15px; margin-right: 10px"
              @click="
                () => {
                  announcementShow = true
                }
              "
            >
              <template #icon>
                <n-icon><MdNotifications /></n-icon>
              </template>
            </n-button>
            <n-avatar
              round
              size="medium"
              :style="getStyle()"
              style="margin-top: 15px; margin-right: 23px"
              :src="avatar"
              @click="DoShowUserInfo()"
            />
          </n-space>
        </n-space>
      </n-layout-header>
      <n-layout has-sider style="height: calc(100vh - 66px); bottom: 0">
        <n-modal
          v-model:show="announcementShow"
          class="custom-card"
          preset="card"
          style="width: 600px"
          title="通知"
          size="huge"
          :bordered="false"
          :segmented="{ content: 'soft', footer: 'soft' }"
        >
          <n-p v-html="announcementHtml"></n-p>
        </n-modal>
        <SideBar v-if="showSideBar" />
        <n-layout :native-scrollbar="false">
          <!-- <div style="text-align: center">
            <n-gradient-text :size="32" type="info"> 祝各位高三学子 </n-gradient-text>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <n-gradient-text :size="46" type="danger"> 高考加油！ </n-gradient-text>
          </div> -->
          <div style="margin-right: 15px; margin-left: 15px; min-height: calc(100vh - 66px)">
            <router-view v-slot="{ Component }">
              <KeepAlive :max="10">
                <Transition name="fade" mode="out-in" :duration="400">
                  <div :key="router.currentRoute.value.name">
                    <component :is="Component" />
                  </div>
                </Transition>
              </KeepAlive>
            </router-view>
          </div>
          <n-divider></n-divider>
          <div style="margin: 15px">
            <div style="text-align: center">
              <n-alert type="default" style="font-size: 20px; display: inline-block">
                <template #icon>
                  <i class="twa-sm twa-speech-balloon"></i>
                </template>
                {{ hitokoto_content }}
              </n-alert>
              <br />
              <br />
              <span style="text-align: center">
                <a target="_blank" href="https://内网穿透.中国/">
                  <n-button text>内网穿透联盟[CFU]</n-button>
                </a>
                识别码:
                <b>JRXHB5D4</b>
              </span>
              <br />
              <span style="text-align: center">
                © {{ nowYear }} LoCyanTeam。保留所有权利。 |
                <a target="_blank" href="https://github.com/LoCyan-Team/LoCyanFrpPanel">
                  <n-button text style="transform: translateY(4.5px)">
                    <template #icon>
                      <n-icon>
                        <git-alt />
                      </n-icon>
                    </template>
                    {{ gitHash }}
                  </n-button>
                </a>
              </span>
              <br />
              <span style="text-align: center">
                <a target="_blank" href="https://www.locyan.cn/doc/yhfw.html"> 服务条款 </a>
                |
                <a target="_blank" href="https://www.locyan.cn/doc/yszc.html"> 隐私政策 </a>
              </span>
              <br />
              <br />
              <span style="text-align: center"
                >"Minecraft" 为美国微软公司的商标，本站与其没有任何从属关系</span
              >
              <br />
            </div>
          </div>
        </n-layout>
      </n-layout>
    </n-layout>
  </n-space>
  <!-- 气死我了zhoudexuan，让我一个写后端的来搓前端，mmp -->
  <!-- 中考完学不会vue你就死定了 -->
  <!-- 2023-7-22-DXCFTDE-老子把你奇奇怪怪的按钮全部改了.再说我不会搓前端你就s定了 -->
  <!-- 2023-8-21-Zhiyuan-我发现了什么？ -->
  <!-- 2023-12-31-Daiyangcheng 突然想起来还有这块神奇的地方，写点东西吧，各位元旦快乐！ -->
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { NGradientText } from 'naive-ui'
import SideBar from '@components/sidebar/MainSidebar.vue'
import userData from '@/utils/stores/userData/store'
import router from '@router'
import UserInfo, { changeUserInfoShow } from '@components/UserInfo.vue'
import { get } from '@/utils/request'
import { GitAlt } from '@vicons/fa'
import { MdNotifications } from '@vicons/ionicons4'
import logger from '@/utils/logger'
import notice from '@/utils/notice'

const gitHash = GIT_COMMITHASH
const nowYear = new Date().getFullYear()

// 手机状态下收缩菜单栏
const collapsed = ref(true)
const avatar = ref('')
const inverted = false
const hitokoto_content = ref('Loading')

if (document.body.clientWidth >= 1000) {
  collapsed.value = false
}

const announcementHtml = ref('')
const announcementShow = ref(false)

onMounted(async () => {
  const time = new Date()
  const year = time.getFullYear()
  const month = time.getMonth()
  const day = time.getDate()
  const current = `${year}-${month}-${day}`

  let result = await notice.getNotice()
  announcementHtml.value = result.announcement
  if (localStorage.getItem('dashboard_last_show_ads_date') !== current)
    announcementShow.value = true
  localStorage.setItem('dashboard_last_show_ads_date', current)
})

avatar.value = userData.getters.get_avatar

// 刚进入面板不展示用户信息框
changeUserInfoShow(false)

function DoShowUserInfo() {
  changeUserInfoShow(true)
}

// function renderIcon(icon) {
//   return () => h(NIcon, null, { default: () => h(icon) })
// }

function getStyle() {
  if (!userData.getters.get_token) {
    return 'display: none;'
  }
}

if (location.pathname === '/') window.location = '/dashboard'

onMounted(async () => {
  let rs
  try {
    rs = await get('https://v1.hitokoto.cn/', {})
  } catch (e) {
    logger.error(e)
    hitokoto_content.value = '加载失败'
  }
  if (!rs) {
    hitokoto_content.value = '加载失败'
    return
  }
  // 一言
  let content = rs.data.hitokoto
  let from = rs.data.from
  hitokoto_content.value = content + ' —— ' + from
})
</script>

<script>
import { ref } from 'vue'

export const showSideBar = ref(false)

export function changeMainSidebarShow(is_show) {
  showSideBar.value = is_show
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
