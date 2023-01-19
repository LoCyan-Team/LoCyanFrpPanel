<template>
    <n-grid cols="4" item-responsive>
        <n-gi v-for="item in Proxies" style="margin: 10px;" span="0:4 950:1" :id="Proxies.indexOf(item)">
            <n-space style="display: block;">
                <n-card :title="'ID: ' + item.id + ' - ' + item.proxy_name">
                    {{ item.proxy_name }}
                    <template #footer>
                        连接地址： <br /> {{ ServerList[item.node].hostname + ":" + item.remote_port }}
                    </template>
                    <template #action>
                        操作：
                        <m-space justify="space-between">
                            <n-button style="margin:2px" strong secondary type="primary">编辑</n-button>
                            <n-button style="margin:2px" strong secondary type="error"
                                @click="deleteProxy(Proxies.indexOf(item))">删除</n-button>
                            <n-button style="margin:2px" strong secondary type="info">详细信息</n-button>
                        </m-space>
                    </template>
                </n-card>
            </n-space>
        </n-gi>
    </n-grid>
</template>

<script setup>
import { ref } from 'vue';
import { NSpace, NCard, NGi, NGrid, NButton, useDialog } from 'naive-ui';
import store from '../utils/store.js';
import { get } from '../utils/request.js';
import { SendSuccessMessage, SendErrorMessage } from '../utils/message';

const Proxies = ref([]);
const ServerList = ref([]);
const dialog = useDialog();

const rs = get("https://api.locyanfrp.cn/Proxies/GetProxiesList?username=" + localStorage.getItem('username') + "&token=" + store.getters.GetToken)
rs.then(res => {
    if (res.status != 0) {
        return res;
    } else {
        Proxies.value = res.proxies;
    };
});

const rs2 = get("https://api.locyanfrp.cn/Proxies/GetServerList");
rs2.then(res => {
    var i = 0;
    res.forEach(s => {
        ServerList.value[s.id] = s;
        i = i + 1;
    });
    console.log(ServerList.value);
});

function deleteProxy(id) {
    dialog.warning({
        title: "警告",
        content: "你确定要删除这个隧道吗？(隧道ID：" + Proxies.value[id].id + ")",
        positiveText: "确定",
        negativeText: "不确定",
        onPositiveClick: () => {
            const rs = get("https://api.locyanfrp.cn/Proxies/Remove?username=" + localStorage.getItem('username') + "&token=" + store.getters.GetToken + "&proxyid=" + Proxies.value[id].id);
            rs.then(res => {
                if (res.status) {
                    SendSuccessMessage(res.message);
                    Proxies.value.splice(id, 1);
                } else {
                    SendErrorMessage(res.message);
                }
            });
        },
        onNegativeClick: () => {
            SendSuccessMessage("你取消了操作！");
        },
        onMaskClick: () => {
            SendSuccessMessage("你取消了操作！");
          },
    });
};

</script>
<style scoped>

</style>