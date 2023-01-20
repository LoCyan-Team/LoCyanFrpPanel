<template>
  <n-config-provider :hljs="hljs" :theme="darkTheme">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <message />
          <loadingbar />
          <ndialog />
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
                    &nbsp;退出登录
                  </n-button>
                </n-space>
              </n-layout-header>
              <n-layout has-sider>
                <n-layout-sider bordered show-trigger :collapsed="collapsed" collapse-mode="width" :collapsed-width="64"
                  :width="240" :native-scrollbar="true" :inverted="inverted">
                  <n-menu :inverted="inverted" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
                    :options="menuOptions" style="margin-top: 25px" default-value="personality" />
                </n-layout-sider>
                <n-layout>
                  <router-view></router-view>
                </n-layout>
              </n-layout>
            </n-layout>
          </n-space>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
  <!-- 气死我了zhoudexuan，让我一个写后端的来搓前端，mmp -->
  <!-- 中考完学不会vue你就死定了 -->
</template>
  
<style scoped>
.n-layout-sider {
  height: calc(100vh - 85px);
}
</style>
  
<script>
</script>

<script setup>
import { NLayout, NMessageProvider, NButton, useMessage, NConfigProvider, darkTheme, NDialogProvider } from "naive-ui";
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
  InformationCircleOutline,
  Person,
  PencilSharp,
  PaperPlane,
  Add,
  List,
  FileTrayFull,
  CloudDownloadOutline,
  PlanetOutline


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
  // {
  //   label: () =>
  //     h(
  //       RouterLink,
  //       {
  //         to: {
  //           path: "/login",
  //         },
  //       },
  //       { default: () => "登录" }
  //     ),
  //   key: "login",
  //   icon: renderIcon(BookIcon),
  // },
  // {
  //   label: () =>
  //     h(
  //       RouterLink,
  //       {
  //         to: {
  //           path: "/register",
  //         },
  //       },
  //       { default: () => "注册" }
  //     ),
  //   key: "register",
  //   icon: renderIcon(BookIcon),
  // },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/user",
          },
        },
        { default: () => "仪表盘" }
      ),
    key: "personality",
    icon: renderIcon(InformationCircleOutline),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/hello2023",
          },
        },
        { default: () => "新年限时活动-1" }
      ),
    key: "newyear",
    icon: renderIcon(PlanetOutline),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/realname",
          },
        },
        { default: () => "实名认证" }
    ),
    key: "real-person-verification",
    icon: renderIcon(Person),
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
    icon: renderIcon(PencilSharp),
  },
  {
    label: "隧道操作",
    key: "control-proxy",
    icon: renderIcon(PaperPlane),
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
        icon: renderIcon(Add),
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
        icon: renderIcon(List),
      },
      {
        label: "配置文件",
        key: "proxy_config",
        icon: renderIcon(FileTrayFull),
      },
    ],
  },
  {
    label: "软件下载",
    key: "software_download",
    icon: renderIcon(CloudDownloadOutline),
  },
];

const inverted = false;
</script>
