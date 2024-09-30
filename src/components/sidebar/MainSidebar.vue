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
import { h, ref } from 'vue'
import { NIcon } from 'naive-ui'

import {
  Add,
  BookOutline as BookIcon,
  CloudDownloadOutline,
  FileTrayFull,
  List,
  PaperPlane,
  PencilSharp,
  Person,
  PlanetOutline,
  Key,
  CompassSharp,
  GameController
} from '@vicons/ionicons5'
import { MoreCircle20Filled } from '@vicons/fluent'
import { AttachMoneyFilled, AccountTreeOutlined } from '@vicons/material'

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
    path: '/dashboard',
    label: '仪表盘',
    key: 'dashboard',
    icon: renderIcon(CompassSharp)
  },
  {
    label: '新春活动',
    key: 'yearly',
    show: false,
    icon: renderIcon(PlanetOutline),
    children: [
      {
        path: '/hello2024',
        label: '评价和祝福',
        show: true,
        key: 'new-year',
        icon: renderIcon(PlanetOutline)
      },
      {
        path: '/prize',
        label: '抽奖',
        show: true,
        key: 'prize',
        icon: renderIcon(PlanetOutline)
      }
    ]
  },
  {
    path: '/verification',
    label: '身份认证',
    key: 'verification',
    icon: renderIcon(Person)
  },
  {
    path: '/sign',
    label: '签到',
    key: 'sign',
    icon: renderIcon(PencilSharp)
  },
  {
    label: '隧道操作',
    key: 'control-proxy',
    icon: renderIcon(PaperPlane),
    children: [
      {
        path: '/proxies',
        label: '隧道列表',
        key: 'proxies-list',
        icon: renderIcon(List)
      },
      {
        path: '/proxies/add',
        label: '添加隧道',
        key: 'proxies-add',
        icon: renderIcon(Add)
      },
      {
        path: '/proxies/config',
        label: '配置文件',
        key: 'proxies-config',
        icon: renderIcon(FileTrayFull)
      }
    ]
  },
  // 没做完，先注释了吧
  // {
  //   path: '/multiplayer',
  //   label: '多人游戏大厅',
  //   key: 'Multiplayer',
  //   icon: renderIcon(MdPaperPlane)
  // },
  {
    path: '/donate',
    label: '赞助',
    key: 'donate',
    icon: renderIcon(AttachMoneyFilled)
  },
  {
    path: '/icp',
    label: '域名白名单',
    key: 'Icp',
    icon: renderIcon(Key)
  },
  {
    label: '游戏联机',
    key: 'games',
    icon: renderIcon(GameController),
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
        path: '/games/minecraft',
        label: 'Minecraft',
        key: 'games-minecraft',
        icon: renderIcon(AccountTreeOutlined)
      }
    ]
  },
  {
    key: 'status',
    icon: renderIcon(List),
    label: () =>
      h(
        'a',
        {
          href: 'https://status.locyan.cn',
          target: '_blank'
        },
        '服务状态'
      )
  },
  {
    label: '其他功能',
    key: 'other_options',
    icon: renderIcon(MoreCircle20Filled),
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
        path: '/other/software',
        label: '软件下载',
        key: 'SoftwareDownload',
        icon: renderIcon(CloudDownloadOutline)
      },
      {
        label: () =>
          h(
            'a',
            {
              href: 'https://docs.locyanfrp.cn',
              target: '_blank'
            },
            '帮助文档'
          ),
        key: 'help_docs',
        icon: renderIcon(BookIcon)
      }
    ]
  }
]

const inverted = false
</script>
<script>
import { ref } from 'vue'
import router from '@router'

const active = ref('')
// const menuInstRef = ref(null)

export const handleUpdateValue = (key, item) => {
  active.value = key
  router.push({ path: item.path })
}

export function setSideBarActiveKey(name) {
  active.value = name
}
</script>
