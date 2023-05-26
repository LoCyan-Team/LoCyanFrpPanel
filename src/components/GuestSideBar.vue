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
      class="h-full bottom-0"
  >
    <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :value="active"
        @update:value="handleUpdateValue"
    />
  </n-layout-sider>
</template>

<script setup>
import {NIcon, NLayoutSider, NMenu} from "naive-ui";
import {h, ref} from "vue";

import {LogInOutline, HomeOutline, SyncOutline, AddOutline} from "@vicons/ionicons5";

// 手机状态下收缩菜单栏
const collapsed = ref(true);
if (document.body.clientWidth >= 1000) {
  collapsed.value = false;
}

function renderIcon(icon) {
  return () => h(NIcon, null, {default: () => h(icon)});
}

const menuOptions = [
  {
    path: "/",
    label: "首页",
    key: "MainPage",
    icon: renderIcon(HomeOutline),
  },
  {
    path: "/login",
    label: "登录",
    key: "Login.vue",
    icon: renderIcon(LogInOutline),
  },
  {
    path: "/register",
    label: "注册",
    key: "register",
    icon: renderIcon(AddOutline),
  },
  {
    path: "/reset_password",
    label: "重置密码",
    key: "reset_password",
    icon: renderIcon(SyncOutline),
  },
];
</script>
<script>
import {ref} from "vue";
import router from "../router/index.js";

const active = ref("");

export const handleUpdateValue = (key, item) => {
  active.value = key;
  router.push({path: item.path});
};

export function SetSideBarActiveKey_Guest(name) {
  active.value = name;
}
</script>
