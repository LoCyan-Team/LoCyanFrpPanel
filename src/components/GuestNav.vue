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
              <GuestSideBar v-if="ShowSideBar"/>
                <n-layout :native-scrollbar="false">
                  <div style="margin-right: 40px">
                    <router-view></router-view>
                  </div>
                </n-layout>
            </n-layout>
        </n-layout>
    </n-space>
</template>

<script setup>
import { NLayout } from "naive-ui";
import { NLayoutHeader } from "naive-ui";
import { NSpace } from "naive-ui";
import { NGradientText } from "naive-ui";
import { h, ref } from "vue";
import { NIcon } from "naive-ui";
import GuestSideBar from "./GuestSideBar.vue";

// 手机状态下收缩菜单栏
const collapsed = ref(true);
if (document.body.clientWidth >= 1000) {
    collapsed.value = false;
}

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

const inverted = false;
</script>
<script>
import {ref} from "vue";

export const ShowSideBar = ref(false);
export function ChangeShowSideBar_Guest (is_show){
  ShowSideBar.value = is_show;
}
</script>