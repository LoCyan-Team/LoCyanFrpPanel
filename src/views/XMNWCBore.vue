<template>
    <n-h1 prefix="bar" style="margin-top: 30px;">
        <i class="twa twa-bookmark-tabs"></i>
        <n-text type="primary">
            bore节点
        </n-text>
    </n-h1>
    <n-alert title="bore穿透" type="info">
        本服务由 XiaMoHuaHuo_CN's Network & Work 提供。<br>
        <!--<b>仅支持IPv6</b><br>-->
        支持快速TCP穿透，在你的电脑上安装rust后运行命令安装bore命令行工具：<br>
        cargo install bore-cli<br>
        或者：<br>
        cargo install borev6-cli<br>
      </n-alert>
    <n-grid cols="1" y-gap="1" item-responsive>
        <n-grid-item span="1">
            <n-card title="启动命令">
                <n-input v-model:value="inp.local_port" type="text" placeholder="本地端口" />
                <n-input v-model:value="inp.node" type="text" placeholder="远程服务器地址" />
                <n-code :code="code" language="shell" show-line-numbers
                    style="overflow:auto; margin-top: 30px;width: 100%;"></n-code>
                <n-button strong secondary type="warning" style="margin-top: 30px" @click="generate()">
                    生成
                </n-button>
                <n-button strong secondary type="info" style="margin-top: 30px" @click="copy(code, $event)">
                    复制启动命令
                </n-button>
            </n-card>
            <br />
        </n-grid-item>

        <n-grid-item span="1">
            <n-data-table :columns="columns" :data="data" />
        </n-grid-item>
    </n-grid>
</template>
  
<script>
</script>
  
<script setup>
import { ref } from 'vue';
import store from "../utils/stores/store.js";
import { get } from '../utils/request';
import { sendSuccessMessage, sendErrorMessage } from '../utils/message';
import clipboard from '..//utils/clipboard'

let data = ref([
    {
        location: "香港",
        bandwidth: "10Gbps/10Gbps",
        address: "b6hk1.lcf.icu",
        port: "50000-65535",
        net: "IPv6"
    },
    {
        location: "加拿大",
        bandwidth: "1Gbps/1Gbps",
        address: "b4ca1.lcf.icu",
        port: "1024-65535",
        net: "IPv4"
    },
    {
        location: "中国-福建-福州",
        bandwidth: "1Gbps/300Mbps",
        address: "b6cnfjfz1.lcf.icu",
        port: "50000-65535",
        net: "IPv6"
    },
])

let inp = ref({
    node: "",
    local_port: ""
})

let unidata = {
    secret: "XMNWCBoreProject",
    node: "<NODE>",
    local_port: "<LOCAL_PORT>"
}

function generate() {
    code = `bore local ${inp.value.local_port} --to ${inp.value.node} --secret ${unidata.secret}`
}

let code = ref(`bore local ${unidata.local_port} --to ${unidata.node} --secret ${unidata.secret}`)

const columns = [
    {
        title: "物理地址",
        key: "location"
    },
    {
        title: "带宽(Download/Upload)",
        key: "bandwidth"
    },
    {
        title: "连接地址",
        key: "address"
    },
    {
        title: "开放端口",
        key: "port"
    },
    {
        title: "网络",
        key: "net"
    }
];

function copy(data, event) {
    clipboard(data, event)
}

</script>
