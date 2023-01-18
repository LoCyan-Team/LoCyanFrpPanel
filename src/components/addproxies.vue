<template>
  <n-form ref="formRef" :model="ProxyInfo" :rules="rules" label-width="auto" :size="large">
    <n-space vertical style="margin: 20px">
      <n-form-item label="选择服务器" path="node">
        <n-select v-model:value="node" :options="ServerList" />
      </n-form-item>
    </n-space>
    <div id="item">
      <p>服务器信息：</p>
      <p>服务器名：{{ ServerValue[node].name }}</p>
      <p>服务器介绍：{{ ServerValue[node].description }}</p>
      <p>服务器IP：{{ ServerValue[node].ip }}</p>
      <p>服务器域名：{{ ServerValue[node].hostname }}</p>
    </div>
    <n-grid cols="2" item-responsive>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="隧道名" path="proxy_name">
          <n-input v-model:value="ProxyInfo.proxy_name" placeholder="隧道名" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="穿透协议" path="proxy_type">
          <n-radio-group v-model:value="ProxyInfo.proxy_type">
            <n-radio-button value="tcp">
              TCP
            </n-radio-button>
            <n-radio-button value="udp">
              UDP
            </n-radio-button>
            <n-radio-button value="http">
              HTTP
            </n-radio-button>
            <n-radio-button value="https">
              HTTPS
            </n-radio-button>
            <n-radio-button value="xtcp">
              XTCP
            </n-radio-button>
            <n-radio-button value="stcp">
              STCP
            </n-radio-button>
          </n-radio-group>
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="内网IP" path="local_ip">
          <n-input v-model:value="ProxyInfo.local_ip" placeholder="内网IP，例如127.0.0.1" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="内网端口" path="local_port">
          <n-input v-model:value="ProxyInfo.local_port" placeholder="内网端口, HTTP:80 HTTPS:443 MC:25565/19136 泰拉瑞亚:7777" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="远程端口" path="remote_port">
          <n-input v-model:value="ProxyInfo.remote_port" placeholder="映射到远程服务器上的端口" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="自定义域名" path="domain">
          <n-input v-model:value="ProxyInfo.domain" placeholder="HTTPS/HTTP需要填写，其他协议不需要填写" />
        </n-form-item>
      </n-grid-item>
    </n-grid>
    <div style="display: flex; justify-content: flex-end">
      <n-button round type="primary" @click="handleValidateButtonClick">
        创建
      </n-button>
    </div>
  </n-form>
</template>

<script setup>
import { NForm, NFormItem, NInput, NButton, NSpace, NSelect, NGrid, NGridItem, NRadioGroup, NRadioButton } from 'naive-ui';
import { ref } from 'vue';
import { get } from '../utils/request.js';

const node = ref(null);
// 选择框数据
const ServerList = ref([]);
// 服务器数据
const ServerValue = ref([]);
// 表格数据
const formRef = ref(null);
// 表单数据集合
const ProxyInfo = ref({
  proxy_name: "",
  proxy_type: "",
  local_ip: "",
  local_port: "",
  remote_port: "",
  domain: ""
});
const rules = {
  proxy_name: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule, value) {
      if (!value) {
        return new Error("请输入隧道名");
      } else if (!/[A-Za-z0-9_]$/.test(value)) {
        return new Error("隧道名格式错误，由字母，数字和下划线组成");
      }
      return true;
    },
  }
}
const rs = get("https://api.locyanfrp.cn/Proxies/GetServerList")
rs.then(res => {
  var i = 0;
  res.forEach(s => {
    // 默认选择第一个节点
    if (i == 0) {
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
.n-form {
  margin: 20px;
}

#item {
  max-width: 100vw;
  margin: 20px;
}

@media (max-width: 1300px) {
  .n-form {
    margin: 10px;
  }
}
</style>