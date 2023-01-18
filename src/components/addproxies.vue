<template>
  <n-space vertical style="margin: 20px">
    <a>选择服务器</a>
    <n-select v-model:value="node" :options="ServerList" />
  </n-space>
  <div style="margin: 20px">
  <p>服务器信息：</p>
  <p>服务器名：{{ ServerValue[node].name }}</p>
  <p>服务器介绍：{{ ServerValue[node].description }}</p>
  <p>服务器IP：{{ ServerValue[node].ip }}</p>
  <p>服务器域名：{{ ServerValue[node].hostname }}</p>
  </div>>
</template>

<script setup>
import { NForm, NInput, NButton, NSpace, NSelect } from 'naive-ui';
import { ref } from 'vue';
import { get } from '../utils/request.js';

const node = ref(null);
const ServerList = ref([]);
const ServerValue = ref([]);

const rs = get("https://api.locyanfrp.cn/Proxies/GetServerList")
rs.then(res => {
    var i = 0;
    res.forEach(s => {
        // 默认选择第一个节点
        if (i == 0){
            node.value = s.id;
        }
        const tmpdict = {
            "label": s.name,
            "value": s.id
        };
        ServerValue.value[s.id] = s;
        ServerList.value[i] = tmpdict;
        i = i + 1;
    });
})

console.log(node.value);

</script>
<style scoped>
/*@import url(); 引入公共css类*/

</style>