<template>
  <n-layout-sider
    bordered
    show-trigger
    :collapsed="collapsed"
    @collapse="collapsed = true"
    @expand="collapsed = false"
    collapse-mode="width"
    :collapsed-width="64"
    :native-scrollbar="true"
    id="sider"
    style="height: 100%; bottom: 0"
  >
    <n-menu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      style=""
      :value="active"
      @update:value="handleUpdateValue"
    />
  </n-layout-sider>
</template>

<script setup>
import { NIcon, NLayoutSider, NMenu } from 'naive-ui'
import { h, ref } from 'vue'

import { CompassOutline, LogInOutline, MailOpenOutline } from '@vicons/ionicons5'
import { KeyReset20Regular } from '@vicons/fluent'

// 手机状态下收缩菜单栏
const collapsed = ref(true)
if (document.body.clientWidth >= 1000) {
  collapsed.value = false
}

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
  {
    path: '/',
    label: '首页',
    key: 'MainPage',
    icon: renderIcon(CompassOutline)
  },
  {
    path: '/auth/login',
    label: '登录',
    key: 'Login',
    icon: renderIcon(LogInOutline)
  },
  {
    path: '/auth/register',
    label: '注册',
    key: 'Register',
    icon: renderIcon(MailOpenOutline)
  },
  {
    path: '/auth/resetPassword',
    label: '重置密码',
    key: 'ResetPassword',
    icon: renderIcon(KeyReset20Regular)
  }
]
</script>
<script>
import { ref } from 'vue'
import router from '@router'

const active = ref('')

export const handleUpdateValue = (key, item) => {
  active.value = key
  router.push({ path: item.path })
}

export function setGuestSidebarActiveKey(name) {
  active.value = name
}
</script>
