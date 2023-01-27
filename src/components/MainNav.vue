<template>
    <n-space vertical>
        <n-layout>
            <n-layout-header :inverted="inverted" bordered>
                <n-space justify="space-between">
                    <n-gradient-text :size="24" type="warning" style="margin-left: 20px; height: 60px; margin-top: 15%">
                        LoCyan Frp
                    </n-gradient-text>
                    <n-space justify="end">
                        <n-avatar round size="medium" :style="getStyle()" style="margin-top: 23px;" :src="avator" />
                        <n-button ghost :style="getStyle()" style="margin: 23px;" round type="primary"
                            @click="logout">退出登录</n-button>
                    </n-space>
                </n-space>
            </n-layout-header>
            <n-layout has-sider style="height: calc(100vh - 83px);bottom: 0">
                <n-layout-sider bordered show-trigger :collapsed="collapsed" @collapse="collapsed = true"
                    @expand="collapsed = false" collapse-mode="width" :collapsed-width="64" :native-scrollbar="true"
                    :inverted="inverted" id="sider" style="height: 100%;bottom: 0">
                    <n-menu :inverted="inverted" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
                        :options="menuOptions" style="" default-value="personality" />
                </n-layout-sider>
                <n-layout :native-scrollbar="false">
                    <router-view></router-view>
                </n-layout>
            </n-layout>
        </n-layout>
    </n-space>
    <!-- 气死我了zhoudexuan，让我一个写后端的来搓前端，mmp -->
    <!-- 中考完学不会vue你就死定了 -->
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
import { NBackTop } from "naive-ui";
import { NLoadingBarProvider } from "naive-ui";
import { RouterLink } from "vue-router";
import { Logout, GetLoginStatus } from "../utils/profile.js";
import { SendSuccessMessage } from "../utils/message.js";
import store from "../utils/store.js";

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

// 手机状态下收缩菜单栏
const collapsed = ref(true);
if (document.body.clientWidth >= 1000) {
    collapsed.value = false;
};

const avator = ref("");

avator.value = localStorage.getItem("avator");

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
};

function getStyle() {
    if (!store.getters.GetToken) {
        return 'display: none;';
    };
};

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
                { default: () => "仪表盘" }
            ),
        key: "personality",
        icon: renderIcon(InformationCircleOutline),
    },
    {
        label: "新年活动集合",
        key: "newyear",
        icon: renderIcon(PlanetOutline),
        children: [
            {
                label: () =>
                    h(
                        RouterLink,
                        {
                            to: {
                                path: "/hello2023",
                            },
                        },
                        { default: () => "评价和祝福" }
                    ),
                key: "newyear-1",
                icon: renderIcon(PlanetOutline),
            },
            {
                label: () =>
                    h(
                        RouterLink,
                        {
                            to: {
                                path: "/prize",
                            },
                        },
                        { default: () => "抽奖" }
                    ),
                key: "newyear-2",
                icon: renderIcon(PlanetOutline),
            }
        ]
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
                label: () =>
                    h(
                        RouterLink,
                        {
                            to: {
                                path: "/config",
                            },
                        },
                        { default: () => "配置文件" }
                    ),
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