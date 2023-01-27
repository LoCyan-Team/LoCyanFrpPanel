<template>
    <n-space vertical>
        <n-layout>
            <n-layout-header :inverted="inverted" bordered>
                <n-space justify="space-between">
                    <n-gradient-text :size="24" type="warning" style="margin-left: 20px; height: 60px; margin-top: 15%">
                        LoCyan Frp
                    </n-gradient-text>
                </n-space>
            </n-layout-header>
            <n-layout has-sider style="height: calc(100vh - 83px);bottom: 0">
                <n-layout-sider bordered show-trigger :collapsed="collapsed" @collapse="collapsed = true"
                    @expand="collapsed = false" collapse-mode="width" :collapsed-width="64" :native-scrollbar="true"
                    :inverted="inverted" id="sider" style="height: 100%;bottom: 0">
                    <n-menu :inverted="inverted" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
                        :options="menuOptions" style="" default-value="login" />
                </n-layout-sider>
                <n-layout :native-scrollbar="false">
                    <router-view></router-view>
                </n-layout>
            </n-layout>
        </n-layout>
    </n-space>
</template>
  
<script>
</script>

<script setup>
import { NLayout, NButton, NAvatar } from "naive-ui";
import { NLayoutHeader } from "naive-ui";
import { NSpace } from "naive-ui";
import { NMenu } from "naive-ui";
import { NLayoutSider } from "naive-ui";
import { NGradientText } from "naive-ui";
import { h, ref } from "vue";
import { NIcon } from "naive-ui";
import { RouterLink } from "vue-router";
import { Logout, GetLoginStatus } from "../utils/profile.js";
import { SendSuccessMessage } from "../utils/message.js";
import store from "../utils/store.js";

import {
    LogInOutline,
    MailOpenOutline

} from "@vicons/ionicons5";

// 手机状态下收缩菜单栏
const collapsed = ref(true);
if (document.body.clientWidth >= 1000) {
    collapsed.value = false;
};

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
};

const menuOptions = [
    {
      label: () =>
        h(
          RouterLink,
          {
            to: {
              path: "/login",
            },
          },
          { default: () => "登录" }
        ),
      key: "login",
      icon: renderIcon(LogInOutline),
    },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: {
              path: "/register",
            },
          },
          { default: () => "注册" }
        ),
      key: "register",
      icon: renderIcon(MailOpenOutline),
    },
];

const inverted = false;
</script>