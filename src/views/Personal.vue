<template>
  <n-h1 prefix="bar" style="margin-left: 15px;margin-top: 30px;">
    <n-text type="primary">
      仪表盘
    </n-text>
  </n-h1>
  <n-alert title="Welcome" type="info" closable style="margin: 20px; margin-top: 20px">
    欢迎来到LoCyanFrp新后台!
    <br />
    公告：{{ contents.contents }}
  </n-alert>
  <n-grid :y-gap="3" cols="3" item-responsive>
    <n-grid-item span="0:3 600:1" id="item" style="margin-bottom: 5px;">
      <n-card title="个人信息" size="large">
        <a>您好，尊敬的 <a id="username">{{ username }}</a></a>
        <br />
        <a>您的邮箱为：{{ email }}</a>
        <br />
        <a>剩余流量：{{ traffic }}</a>
        <br />
        <a>速度限制：{{ outbound }} / {{ inbound }}</a>
        <br />
        <a>访问秘钥：{{ frptoken }}</a>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:3 600:2" id="item">
      <n-card title="数据报表" size="large" style="margin-bottom: 15px">
        <n-space>
          <n-statistic label="剩余流量" tabular-nums>
            <n-number-animation ref="TrafficRef" :from="0" :to="store.getters.GetTraffic" />
            <template #suffix>
              GiB
            </template>
          </n-statistic>
          <n-statistic label="隧道数" tabular-nums style="margin-left: 30px;">
            <n-number-animation ref="ProxiesRef" :from="0" :to="Proxiesanimation" />
            <template #suffix>
              条
            </template>
          </n-statistic>
        </n-space>
      </n-card>
      <n-card title="使用方法">
        我把使用方法都写在首页了总没人看不见了吧？
        <n-divider />
        1. 点击隧道操作中的创建隧道, 填写自己隧道的相应信息（部分高级功能请前往旧面板新建）<br />
        随后点击软件下载, 进入LoCyanFrpMSApp/Lastet文件夹, 随意下载一个版本<br />
        随后启动客户端, 选择登录后登录自己的账号<br />
        在转到隧道管理, 随后启动你的隧道即可<br />
        第一次启动请查看自己的日志文件, 确认日志文件最后一行显示 “启动成功”<br />
        好了, 开始享受吧<br />
        2. 若需要Frp的高级功能, 你可以前往旧面板配置隧道后前往软件下载页面, 进入LoCyanFrp-0.4X.X的文件夹<br />
        下载适合自己系统架构的软件, 随后即可自行配置<br />
        注意, 萌新使用此方法导致不会用的后果自行承担<br />
        <n-divider />
        3. 注意事项：<br />
        (1). 若因为自己的迷幻操作导致的各种问题我们没有义务给予回答<br />
        (2). 不要因为群里没有人回答你的问题而到处宣扬我们没素质, 在诋毁我们之前请你想想你自身有没有做到自己该做的事情<br />
        (3). 我们是公益性的服务, 不要把我们和某花的服务进行比较, 免费的服务无法保障稳定性等各方面的问题, 若有这方面的需求希望你可以购买专业服务器搭建服务<br />
        (4). 我们承诺, 我们留存的用户数据全部采用业内标准的加密格式, 而我们的数据库也采用异地的方式, 我们不会用用户的个人隐私数据开玩笑, 某些说我们盗取用户数据的人, 也请你们说话过过脑子,
        不要错误引导其他用户<br />
        (5). 不准搭建关于赌博, 黄色, 血腥, 暴力, 爆破, 发包, 代刷网, 发卡网等有违中国法律的站点或服务, 一经发现, 我们有不在事先通知用户的情况下删除隧道, 封停账户, 将信息上报公安的权力,
        不要试图挑战我们的底线<br />
        (6). 我们允许建设图床, 网盘等服务, 但必须建设在香港千兆服务器上, 在2023/01/28之前建立的隧道不用遵循此规定, 违规的隧道将会被强制迁移, 这是为了保障大部分用户的体验<br />
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
import { NCard, NAlert, NButton, NSpace, useMessage, NGrid, NGridItem, NStatistic, NNumberAnimation, NDivider, NH1, NText } from "naive-ui";
import { GetContents, GetLoginStatus, GetProxies } from "../utils/profile.js";
import { ref } from "vue";
import store from "../utils/store.js";
import { get } from "../utils/request.js";
import router from "../router/index.js";

localStorage.setItem("ViewPage", "personality");

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

    },
  },
});
</script>