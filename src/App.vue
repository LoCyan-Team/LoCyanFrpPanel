<template>
  <n-config-provider :hljs="hljs">
    <n-loading-bar-provider>
      <n-message-provider>
        <message />
        <loadingbar />
        <n-back-top :right="100" />
        <n-space vertical>
          <n-layout>
            <n-layout-header :inverted="inverted" bordered>
              <n-space justify="space-between">
                <n-gradient-text :size="24" type="warning" style="margin-left: 20px; height: 60px; margin-top: 7%">
                  LoCyan Frp 后台管理面板
                </n-gradient-text>
                <n-button ghost :style="getStyle()" style="margin-right: 20px; margin-top: 20%" round type="primary"
                  @click="logout">
                  &nbsp;&nbsp;退出登录！
                </n-button>
              </n-space>
            </n-layout-header>
            <n-layout has-sider>
              <n-layout-sider :style="getStyle()" bordered show-trigger :collapsed="collapsed" collapse-mode="width" :collapsed-width="64"
                :width="240" :native-scrollbar="true" :inverted="inverted">
                <n-menu :style="getStyle()" :inverted="inverted" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
                  :options="menuOptions" style="margin-top: 25px" default-value="personality" />
              </n-layout-sider>
              <n-layout>
                <router-view></router-view>
              </n-layout>
            </n-layout>
            <n-layout-footer :inverted="inverted" bordered style="position: fixed; bottom: 0px">
              <a style="text-align: center">CopyRight &copy; 2019-2022 LoCyan Co.</a>
            </n-layout-footer>
          </n-layout>
        </n-space>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
  
<style scoped>
* {
  margin: 0;
  padding: 0;
}

body {
  width: 100vw;
}

.n-layout-sider {
  height: calc(100vh - 85px);
}
</style>
  
<script>
</script>

<script setup>
import { NLayout, NMessageProvider, NButton, useMessage, NConfigProvider } from "naive-ui";
import { NLayoutHeader } from "naive-ui";
import { NLayoutFooter } from "naive-ui";
import { NSpace } from "naive-ui";
import { NMenu } from "naive-ui";
import { NLayoutSider } from "naive-ui";
import { NGradientText } from "naive-ui";
import { h, defineComponent, ref } from "vue";
import { NIcon } from "naive-ui";
import { NBackTop } from "naive-ui";
import { NLoadingBarProvider } from "naive-ui";
import { useLoadingBar } from "naive-ui";
import { RouterLink } from "vue-router";
import { Logout, GetLoginStatus } from "./utils/profile.js";
import { SendSuccessMessage } from "./utils/message.js";
import store from "./utils/store.js";
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'

import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon,
  
} from "@vicons/ionicons5";

hljs.registerLanguage('javascript', javascript);

// 手机状态下收缩菜单栏
const collapsed = ref(true);
if (document.body.clientWidth >= 1000) {
  collapsed.value = false;
};


function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
};

function getStyle() {
  if (!store.getters.GetToken) {
    return 'display: none;';
  };
};

GetLoginStatus(store.getters.GetUserName, store.getters.GetToken);

function logout() {
  SendSuccessMessage("您已从LCF登出，感谢您的使用！")
  Logout();
};

const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/user",
          },
        },
        { default: () => "个人信息" }
      ),
    key: "personality",
    icon: renderIcon(BookIcon),
  },
  {
    label: "实名认证（必须）",
    key: "real-person-verification",
    icon: renderIcon(BookIcon),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/sign",
          },
        },
        { default: () => "签到" }
      ),
    key: "Sign",
    icon: renderIcon(BookIcon),
  },
  {
    label: "隧道操作",
    key: "control-proxy",
    icon: renderIcon(BookIcon),
    children: [
      {
        label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/proxies/addproxies",
          },
        },
        { default: () => "添加隧道" }
      ),
        key: "add_proxy",
        icon: renderIcon(PersonIcon),
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: "/proxies",
              },
            },
            { default: () => "隧道列表" }
          ),
        key: "proxy_list",
        icon: renderIcon(PersonIcon),
      },
      {
        label: "配置文件",
        key: "proxy_config",
        icon: renderIcon(PersonIcon),
      },
    ],
  },
  {
    label: "软件下载",
    key: "software_download",
    icon: renderIcon(BookIcon),
  },
];

const inverted = false;
</script>