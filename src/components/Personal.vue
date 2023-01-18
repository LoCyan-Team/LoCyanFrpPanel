<template>
  <n-alert title="Welcome" type="info" closable style="margin: 20px; margin-top: 20px">
    欢迎来到LoCyanFrp新后台!
    <br />
    公告：{{ contents.contents }}
  </n-alert>
  <n-grid :y-gap="3" cols="3" item-responsive>
    <n-grid-item span="0:3 600:1" id="item" style="margin-bottom: 5px;">
      <n-card title="个人信息" size="large">
        <span>您好，尊敬的 <a id="username">{{ username }}</a></span>
        <br />
        <span>您的邮箱为：{{ email }}</span>
        <br />
        <span>剩余流量：{{ traffic }}</span>
        <br />
        <spam>速度限制：{{ outbound }} / {{ inbound }}</spam>
        <br />
        <spam>访问秘钥：{{ frptoken }}</spam>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:3 600:2" id="item">
      <n-card title="数据报表" size="large" style="margin-bottom: 15px">
        <n-space>
          <n-statistic label="流量" tabular-nums>
            <n-number-animation ref="TrafficRef" :from="0" :to="trafficanimation" />
            <template #suffix>
              GiB
            </template>
          </n-statistic>
          <n-statistic label="隧道数" tabular-nums>
            <n-number-animation ref="ProxiesRef" :from="0" :to="Proxiesanimation" />
            <template #suffix>
              条
            </template>
          </n-statistic>
        </n-space>
      </n-card>
      <n-card title="使用方法">
          我把使用方法都写在首页了总没人看不见了吧？
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<style scoped>

#item {
  max-width: 100vw;
  margin: 20px;
}

@media (max-width: 1000px) {
    #item {
      max-width: 100vw;
      margin: 10px;
  }
}

#username {
  color: hsl(199, 100%, 50%);
  font-size: 20px;
}
</style>

<script setup>
import { NCard, NAlert, NButton, NSpace, useMessage, NGrid, NGridItem, NStatistic, NNumberAnimation } from "naive-ui";
import { GetContents, GetLoginStatus, GetProxies} from "../utils/profile.js";
import { ref } from "vue";
import store from "../utils/store.js";
import { get } from "../utils/request.js";
import router from "../router/index.js";

const username = store.getters.GetUserName;
// 检查登录是否过期
GetLoginStatus(username, store.getters.GetToken);
GetProxies(username, store.getters.GetToken);
const email = store.getters.GetEmail;
const inbound = store.getters.GetInBound + "Mbps 下行";
const outbound = store.getters.GetOutBound + "Mbps 上行";
const frptoken = store.getters.GetFrpToken;
const contents = GetContents();
const message = useMessage();
</script>

<script>
import { defineComponent } from "vue";

const traffic = ref(Number(localStorage.getItem("traffic")) / 1024 + "GB");
const trafficanimation = ref(Number(localStorage.getItem("traffic")) / 1024);
const Proxiesanimation = ref(Number(localStorage.getItem("proxies")));

const TrafficRef = ref(null);
const ProxiesRef = ref(null);

// 流量定时刷新
export default defineComponent({

  data() {
    return {
      timer: null,
      traffic,
    };
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getFxItemlist();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    getFxItemlist() {
      // 每次访问都会执行一次status，这边刷新本地存储就好了
      traffic.value = Number(localStorage.getItem("traffic")) / 1024 + "GB";
      trafficanimation.value = Number(localStorage.getItem("traffic")) / 1024;
    },
  },
});
</script>