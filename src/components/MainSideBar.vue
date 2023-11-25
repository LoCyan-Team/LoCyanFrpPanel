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
      :inverted="inverted"
      id="sider"
      style="height: 100%; bottom: 0"
  >
    <n-menu
        ref="menuInstRef"
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
import {h, ref} from "vue";
import {NIcon} from "naive-ui";

import {
  Add,
  BookOutline as BookIcon,
  CloudDownloadOutline,
  FileTrayFull,
  InformationCircleOutline,
  List,
  Flash,
  PaperPlane,
  PencilSharp,
  Person,
  PlanetOutline,
  KeyOutline,
  CompassSharp
} from "@vicons/ionicons5";
import {AttachMoneyFilled} from "@vicons/material";

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
    path: "/dashboard",
    label: "仪表盘",
    key: "DashBoard",
    icon: renderIcon(CompassSharp),
  },
  {
    label: "周年庆活动",
    key: "yearly",
    show: false,
    icon: renderIcon(PlanetOutline),
    children: [
      {
        path: "/hello2023",
        label: "评价和祝福",
        show: false,
        key: "NewYear",
        icon: renderIcon(PlanetOutline),
      },
      {
        path: "/prize",
        label: "抽奖",
        show: true,
        key: "Prize",
        icon: renderIcon(PlanetOutline),
      },
    ],
  },
  {
    path: "/realname",
    label: "实名认证",
    key: "RealName",
    icon: renderIcon(Person),
  },
  {
    path: "/sign",
    label: "签到",
    key: "Sign",
    icon: renderIcon(PencilSharp),
  },
  {
    label: "隧道操作",
    key: "control-proxy",
    icon: renderIcon(PaperPlane),
    children: [
      {
        path: "/proxies/addproxies",
        label: "添加隧道",
        key: "AddProxies",
        icon: renderIcon(Add),
      },
      {
        path: "/proxies",
        label: "隧道列表",
        key: "Proxies",
        icon: renderIcon(List),
      },
      {
        path: "/config",
        label: "配置文件",
        key: "Config",
        icon: renderIcon(FileTrayFull),
      },
    ],
  },
  {
    path: "/xmnetwork/bore",
    label: "Bore 穿透",
    key: "XMNWC-Bore",
    icon: renderIcon(Flash),
  },
  {
    path: "/donate",
    label: "赞助",
    key: "Donate",
    icon: renderIcon(AttachMoneyFilled),
  },
  {
    path: "/icp",
    label: "域名白名单",
    key: "Icp",
    icon: renderIcon(KeyOutline),
  },
  {
    path: "/status",
    label: "节点状态",
    key: "Status",
    icon: renderIcon(List),
  },
  {
    label: "其他功能",
    key: "other_options",
    icon: renderIcon(BookIcon),
    children: [
      // {
      //   label: () =>
      //       h(
      //           "a",
      //           {
      //             href: "https://download.locyan.cn",
      //             target: "_blank",
      //           },
      //           "软件下载"
      //       ),
      //   key: "software_download",
      //   icon: renderIcon(CloudDownloadOutline),
      // }, 
      {
        label: () =>
            h(
                "a",
                {
                  href: "https://pan.1l1.icu/s/MAhO?password=o28hn3",
                  target: "_blank",
                },
                "软件下载"
            ),
        key: "software_download_backup",
        icon: renderIcon(CloudDownloadOutline),
      },
      {
        label: () =>
            h(
                "a",
                {
                  href: "https://doc.locyan.cn",
                  target: "_blank",
                },
                "帮助文档"
            ),
        key: "help_docs",
        icon: renderIcon(BookIcon),
      },
    ],
  },
];

const inverted = false;
</script>
<script>
import { ref } from "vue";
import router from "../router/index.js";

const active = ref("");
const menuInstRef = ref(null);

export const handleUpdateValue = (key, item) => {
  active.value = key;
  router.push({path: item.path});
};

export function SetSideBarActiveKey(name) {
  active.value = name;
}
</script>