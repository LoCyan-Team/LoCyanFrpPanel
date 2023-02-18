<template>
        <n-layout-sider bordered show-trigger :collapsed="collapsed" @collapse="collapsed = true"
                        @expand="collapsed = false" collapse-mode="width" :collapsed-width="64" :native-scrollbar="true"
                        id="sider" style="height: 100%;bottom: 0">
          <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" style="" :value="active"  @update:value="handleUpdateValue"/>
        </n-layout-sider>
</template>

<script>
</script>

<script setup>
import { NLayout } from "naive-ui";
import { NMenu } from "naive-ui";
import { NLayoutSider } from "naive-ui";
import { h, ref } from "vue";
import { NIcon } from "naive-ui";
import { RouterLink } from "vue-router";
import router from "../router/index.js";

import {
  BookOutline as BookIcon,
  InformationCircleOutline,
  Person,
  PencilSharp,
  PaperPlane,
  Add,
  List,
  FileTrayFull,
  CloudDownloadOutline,
  PlanetOutline, LogInOutline, MailOpenOutline


} from "@vicons/ionicons5";

// 激活的按钮参数
const active = ref("");
// 手机状态下收缩菜单栏
const collapsed = ref(true);
if (document.body.clientWidth >= 1000) {
  collapsed.value = false;
}

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const handleUpdateValue = (key, item) => {
  active.value = key;
  router.push({ path: item.path });
};

function SetSideBarActiveKey(name) {
  active.value = name;
}

window.SetSideBarActiveKey_Guest = SetSideBarActiveKey;

const menuOptions = [
  {
    path: "/login",
    label: "登录",
    key: "login",
    icon: renderIcon(LogInOutline),
  },
  {
    path: "/register",
    label: "注册",
    key: "register",
    icon: renderIcon(MailOpenOutline),
  },
];

</script>