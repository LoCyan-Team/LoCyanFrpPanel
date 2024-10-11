<template>
  <n-layout-sider
    bordered
    show-trigger
    :collapsed="collapsed"
    @collapse="collapsed = true"
    @expand="collapsed = false"
    collapse-mode="width"
    :collapsed-width="64"
    :native-scrollbar="false"
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

import router from '@router'
import { useRoute } from 'vue-router'

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
    key: 'root',
    icon: renderIcon(CompassOutline)
  },
  {
    path: '/auth/login',
    label: '登录',
    key: 'login',
    icon: renderIcon(LogInOutline)
  },
  {
    path: '/auth/register',
    label: '注册',
    key: 'register',
    icon: renderIcon(MailOpenOutline)
  },
  {
    path: '/auth/resetPassword',
    label: '重置密码',
    key: 'password-reset',
    icon: renderIcon(KeyReset20Regular)
  }
]

const active = ref('')

router.beforeEach((to, from, next) => {
  computeActiveKey(menuOptions, to.path)
  next()
})

const computeActiveKey = (menuOptions, path) => {
  for (const option of menuOptions) {
    if (option.children instanceof Array) {
      computeActiveKey(option.children, path)
    }
    if (option.path === path) {
      active.value = option.key
    }
  }
}
const route = useRoute()
computeActiveKey(menuOptions, route.path)

const handleUpdateValue = (key, item) => {
  router.push({ path: item.path })
}
</script>
