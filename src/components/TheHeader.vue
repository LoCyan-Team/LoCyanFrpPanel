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
    <n-p v-html="announcementHtml"></n-p>
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
      <n-avatar
        round
        size="medium"
        :style="userData.getters.get_token ? '' : 'display: none;'"
        style="margin-top: 15px; margin-right: 23px"
        :src="avatar"
        @click="() => changeUserInfoShow(true)"
      />
    </n-space>
  </n-space>
</template>
<script setup>
import { NGradientText } from 'naive-ui'
import { MdNotifications } from '@vicons/ionicons4'
import { onMounted, ref } from 'vue'
import notice from '@/utils/notice'
import userData from '@/utils/stores/userData/store'
import { changeUserInfoShow } from '@components/UserInfo.vue'

const avatar = ref('')
const announcementHtml = ref('')
const showAnnouncement = ref(false)

avatar.value = userData.getters.get_avatar

userData.subscribe((mutation, state) => {
  if (mutation.type === 'set_avatar' || mutation.type === 'set_user_info') {
    avatar.value = state.avatar
  }
})

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
