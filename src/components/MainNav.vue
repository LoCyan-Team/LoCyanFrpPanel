<template>
  <UserInfo/>
    <n-space vertical>
        <n-layout>
            <n-layout-header :inverted="inverted" bordered>
                <n-space justify="space-between">
                    <n-gradient-text :size="24" type="warning" style="margin-left: 20px; height: 60px; margin-top: 15%">
                        LoCyan Frp
                    </n-gradient-text>
                    <n-space justify="end" style="margin-right: 20px">
                        <n-avatar round size="medium" :style="getStyle()" style="margin-top: 23px;" :src="avatar" @click="DoShowUserInfo()"/>
                    </n-space>
                </n-space>
            </n-layout-header>
            <n-layout has-sider style="height: calc(100vh - 83px);bottom: 0">
              <SideBar v-if="ShowSideBar"/>
                <n-layout :native-scrollbar="false">
                  <div style="margin-right: 15px; margin-left: 15px">
                    <router-view></router-view>
                  </div>
                    <div style="margin-top: 25px; margin-bottom: 20px;">
                        <div style="text-align: center;">
                            <a style="text-align: center;">Daiyangcheng 策划 / 运营 | DXCFTDE, Zhiyuan 协助</a>
                            <br>
                            <a style="text-align: center;">LoCyan Team 所有</a>
                            <br>
                            <a style="text-align: center;">鸣谢: XiaMoHuaHuo-CN, 天宇网络, LiteCat</a>
                        </div>
                    </div>
                </n-layout>
            </n-layout>
        </n-layout>
    </n-space>
    <!-- 气死我了zhoudexuan，让我一个写后端的来搓前端，mmp -->
    <!-- 中考完学不会vue你就死定了 -->
</template>

<script setup>
import { NLayout, NAvatar } from "naive-ui";
import { NLayoutHeader } from "naive-ui";
import { NSpace } from "naive-ui";
import { NGradientText } from "naive-ui";
import { h, ref } from "vue";
import { NIcon } from "naive-ui";
import SideBar from "./MainSideBar.vue";
import store from "../utils/store.js";
import UserInfo from "./UserInfo.vue";
import { ChangeUserInfoShow } from "./UserInfo.vue";

// 手机状态下收缩菜单栏
const collapsed = ref(true);
if (document.body.clientWidth >= 1000) {
    collapsed.value = false;
}

const avatar = ref("");

avatar.value = store.getters.GetAvatar;

function DoShowUserInfo(){
  ChangeUserInfoShow(true);
}

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

function getStyle() {
    if (!store.getters.GetToken) {
        return 'display: none;';
    }
}

const inverted = false;
</script>
<script>
import {ref} from "vue";

export const ShowSideBar = ref(false);
export function ChangeShowSideBar_Main (is_show){
  ShowSideBar.value = is_show;
}
</script>