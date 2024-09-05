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
        <GuestSideBar v-if="ShowSideBar" />
        <n-layout :native-scrollbar="false">
          <!-- <div style="text-align: center">
            <n-gradient-text :size="32" type="info"> 祝各位高三学子 </n-gradient-text>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <n-gradient-text :size="46" type="danger"> 高考加油！ </n-gradient-text>
          </div> -->
          <div style="margin-right: 15px; margin-left: 15px">
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
        </n-layout>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<script setup>
import { h, ref, onMounted } from 'vue'
import { NGradientText } from 'naive-ui'
import GuestSideBar from './GuestSideBar.vue'
import router from '@/router/index'
import { get } from '@/utils/request.js'

// 手机状态下收缩菜单栏
const collapsed = ref(true)
if (document.body.clientWidth >= 1000) {
  collapsed.value = false
}

const hitokoto_content = ref('')

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const inverted = false

onMounted(async () => {
  let rs
  try {
    rs = await get('https://v1.hitokoto.cn/', {})
  } catch {
    hitokoto_content.value = '加载失败'
  }
  if (!rs) return
  // 一言
  let content = rs.data.hitokoto
  let from = rs.data.from
  hitokoto_content.value = content + ' —— ' + from
})
</script>
<script>
import { ref } from 'vue'

export const ShowSideBar = ref(false)

export function ChangeShowSideBar_Guest(is_show) {
  ShowSideBar.value = is_show
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
