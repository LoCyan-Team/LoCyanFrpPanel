<template>
    <n-grid cols="4" item-responsive>
        <n-gi v-for="item in Proxies" style="margin: 10px;" span="0:4 600:1">
            <n-space style="display: block;">
                <n-card :title="'ID: ' + item.id">
                    {{ item.proxy_name }}
                    <template #footer>
                        连接地址： <br /> {{ item.local_ip }}
                    </template>
                    <template #action>
                        操作：
                        <m-space justify="space-between">
                            <n-button style="margin:2px" strong secondary type="primary">编辑</n-button>
                            <n-button style="margin:2px" strong secondary type="error">删除</n-button>
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
import { NSpace, NCard, NGi, NGrid, NButton } from 'naive-ui';
import { GetProxies } from "../utils/profile.js";
import axios from 'axios';
import store from '../utils/store.js';
import { get } from '../utils/request.js';
import { stringify } from 'qs';
const Proxies = ref([]);

const rs = get("https://api.locyanfrp.cn/Proxies/GetProxiesList?username=" + localStorage.getItem('username') + "&token=" + store.getters.GetToken)
rs.then(res => {
    if (res.status != 0) {
        return res;
    } else {
        Proxies.value = res.proxies;
    };
});

</script>
<style scoped>

</style>