<template>
    <n-h1 prefix="bar" style="margin-top: 30px">
        <i class="twa twa-spiral-calendar"></i>
        <n-text type="primary"> 节点状态</n-text>
    </n-h1>
    <n-space vertical>
        <n-button strong secondary type="info" @click="getList()">
            手动刷新列表
        </n-button>
        <n-grid cols="3" x-gap="10" y-gap="10" item-responsive>
            <n-gi span="0:3 950:1" v-for="i in StatusList" v-show="i.active === 'online'">
                <n-card :title=i.name size="medium">
                    <n-space justify="space-between">
                        <n-grid cols="4" :x-gap="100" item-responsive>
                            <n-gi span="1">
                                <n-progress type="circle" :percentage="Number(Number(i.cpu).toFixed(1))" />
                            </n-gi>
                            <n-gi span="3">
                                <n-space justify="space-between">
                                    <n-text>下行带宽：{{ (i.net_in / 1024 / 128).toFixed(2) }} Mbps</n-text>
                                    <n-text>上行带宽：{{ (i.net_out / 1024 / 128).toFixed(2) }} Mbps</n-text>
                                    <n-text>下行流量：{{ (i.net_in_transfer / 1024 / 1024 / 1024).toFixed(2) }} GB</n-text>
                                    <n-text>上行流量：{{ (i.net_out_transfer / 1024 / 1024 / 1024).toFixed(2) }} GB</n-text>
                                </n-space>
                            </n-gi>
                        </n-grid>
                    </n-space>
                </n-card>
            </n-gi>
        </n-grid>
    </n-space>
</template>
<script setup>
import { ref } from "vue";
import { get } from "../utils/request.js";

const StatusList =
    ref([
        {
            id: 0,
            name: "",
            cpu: 0,
            mem: 0,
            net_in: 0,
            net_out: 0,
            net_in_transfer: 0,
            net_out_transfer: 0,
            active: "offline",
        }
    ]);

function getList() {
    const rs = get("https://api-v2.locyanfrp.cn/api/v2/status/nezha");
    rs.then((res) => {
        let i = 0;
        StatusList.value = res.data.results;
    });
}

setInterval(() => {
    getList();
}, 2500)
getList();
</script>