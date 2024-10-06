<template>
  <n-space vertical>
    <n-layout>
      <n-layout-header :inverted="inverted" bordered>
        <n-space justify="space-between">
          <n-gradient-text
            :size="24"
            type="warning"
            style="margin-left: 20px; height: 50px; margin-top: 10%"
          >
            LoCyanFrp
          </n-gradient-text>
        </n-space>
      </n-layout-header>
      <n-layout has-sider style="height: calc(100vh - 66px); bottom: 0">
        <GuestSidebar v-if="showSideBar" />
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
</template>

<script setup>
import { h, ref, onMounted } from 'vue'
import { NGradientText } from 'naive-ui'
import { GitAlt } from '@vicons/fa'
import GuestSidebar from '@components/sidebar/GuestSidebar.vue'
import router from '@router'
import { get } from '@/utils/request'

const gitHash = GIT_COMMITHASH
const nowYear = new Date().getFullYear()

// 手机状态下收缩菜单栏
const collapsed = ref(true)
if (document.body.clientWidth >= 1000) {
  collapsed.value = false
}

const hitokoto_content = ref('Loading')

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const inverted = false

onMounted(async () => {
  let rs
  try {
    rs = await get('https://v1.hitokoto.cn/', {})
  } catch (e) {
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

export function changeShowGuestSidebar(is_show) {
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
