<template>
        <n-layout-sider bordered show-trigger :collapsed="collapsed" @collapse="collapsed = true"
                        @expand="collapsed = false" collapse-mode="width" :collapsed-width="64" :native-scrollbar="true"
                        :inverted="inverted" id="sider" style="height: 100%;bottom: 0">
          <n-menu ref="menuInstRef" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" style="" :value="active"  @update:value="handleUpdateValue"/>
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
  PlanetOutline


} from "@vicons/ionicons5";

const active = ref("");
const menuInstRef = ref(null);
// 手机状态下收缩菜单栏
const collapsed = ref(true);
if (document.body.clientWidth >= 1000) {
  collapsed.value = false;
};

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const handleUpdateValue = (key, item) => {
  active.value = key;
  router.push({ path: item.path });
};

function SetSideBarActiveKey(name) {
  active.value = name;
  menuInstRef.value.showOption(name);
}

window.SetSideBarActiveKey = SetSideBarActiveKey;

const menuOptions = [
  {
    path: "/user",
    label: "仪表盘",
    key: "User",
    icon: renderIcon(InformationCircleOutline),
  },
  {
    label: "新年活动集合",
    key: "newyear",
    show: false,
    icon: renderIcon(PlanetOutline),
    children: [
      {
        path: "/hello2023",
        label: "评价和祝福",
        key: "newyear",
        icon: renderIcon(PlanetOutline),
      },
      {
        path: "/prize",
        label: "抽奖",
        key: "prize",
        icon: renderIcon(PlanetOutline),
      }
    ]
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
        key: "config",
        icon: renderIcon(FileTrayFull),
      },
    ],
  },
  {
    label: "其他功能",
    key: "other_options",
    icon: renderIcon(BookIcon),
    children: [
      {
        label: () => h(
            "a",
            {
              href: "https://download.locyan.cn",
              target: "_blank"
            },
            "软件下载"
        ),
        key: "software_download",
        icon: renderIcon(CloudDownloadOutline),
      },
      {
        label: () => h(
            "a",
            {
              href: "https://doc.locyan.cn",
              target: "_blank"
            },
            "帮助文档"
        ),
        key: "help_docs",
        icon: renderIcon(BookIcon),
      }
    ]
  }
];

const inverted = false;
</script>
<script>
import { ref } from "vue";

</script>