<template>
  <n-modal
    v-model:show="showAnnouncement"
    class="custom-card"
    preset="card"
    style="width: 600px"
    title="通知"
    size="huge"
    :bordered="false"
    :segmented="{ content: 'soft', footer: 'soft' }"
  >
    <n-text class="markdown-body" v-html="announcementHtml"></n-text>
  </n-modal>
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
        @click="() => (showAnnouncement = true)"
      >
        <template #icon>
          <n-icon><MdNotifications /></n-icon>
        </template>
      </n-button>
      <n-dropdown :options="avatarOptions" @select="handleAvatarOptionSelect">
        <n-avatar
          round
          size="medium"
          v-show="userData.getters.get_token !== '' && userData.getters.get_token !== null"
          style="margin-top: 15px; margin-right: 23px"
          :src="avatar"
        />
      </n-dropdown>
    </n-space>
  </n-space>
</template>
<script setup>
import { NGradientText, NIcon } from 'naive-ui'
import { MdNotifications } from '@vicons/ionicons4'
import { h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '@/utils/profile'
import notice from '@/utils/notice'
import userData from '@/utils/stores/userData/store'
import { PersonCircleOutline, LogOutOutline } from '@vicons/ionicons5'
import Notification from '@/utils/notification'
// import { changeUserInfoShow } from '@/components/UserInfo.vue'

const router = useRouter()
const notification = new Notification()

const avatar = ref('')
const announcementHtml = ref('')
let showAnnouncement = ref(false)

avatar.value = userData.getters.get_avatar

userData.subscribe((mutation, state) => {
  if (mutation.type === 'set_avatar' || mutation.type === 'set_user_info') {
    avatar.value = state.avatar
  }
})

const avatarOptions = [
  {
    label: '用户资料',
    key: 'profile',
    icon: renderIcon(PersonCircleOutline)
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogOutOutline)
  }
]

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

function handleAvatarOptionSelect(key) {
  switch (key) {
    case 'profile':
      router.push({ name: 'Me' })
      break
    case 'logout':
      logout()
      notification.success('已登出', '感谢您的使用！')
      router.push({ name: 'Login' })
  }
}

onMounted(async () => {
  const time = new Date()
  const year = time.getFullYear()
  const month = time.getMonth()
  const day = time.getDate()
  const current = `${year}-${month}-${day}`

  let result = await notice.getNotice()
  announcementHtml.value = result.announcement
  if (localStorage.getItem('dashboard_last_show_ads_date') !== current)
    showAnnouncement.value = true
  localStorage.setItem('dashboard_last_show_ads_date', current)
})
</script>
