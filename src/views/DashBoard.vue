<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-compass"></i>
    <n-text type="primary"> 仪表盘</n-text>
  </n-h1>
  <n-modal
      v-model:show="showads"
      class="custom-card"
      preset="card"
      style="width: 600px"
      title="通知"
      size="huge"
      :bordered="false"
      :segmented="{ content: 'soft', footer: 'soft' }"
  >
    <n-p v-html="ads_content"></n-p>
  </n-modal>
  <template v-if="notice.contents">
    <n-alert :title="username + '，' + howtosayhi()" type="info" closable class="right">
      <template #icon>
        <i class="twa twa-hibiscus"></i>
      </template>
        欢迎来到 LoCyanFrp 新后台!
      <br/>
      <i class="twa twa-bell"></i> 通知：{{ notice.contents }}
    </n-alert>
  </template>
  <template v-else>
    <n-alert title="" type="info" closable>
      <template #icon>
        <i class="twa twa-hibiscus"></i>
      </template>
      <n-skeleton text :repeat="2" style="width: 50%"/>
    </n-alert>
  </template>
  <br/>
  <n-grid :y-gap="3" :x-gap="20" cols="3" item-responsive>
    <n-grid-item span="0:3 600:1">
      <n-card title="个人信息" size="medium">
        <a
        >您好，尊敬的 <a id="username">{{ username }}</a></a
        >
        <br/>
        <a>您的邮箱为：{{ email }}</a>
        <br/>
        <div v-if="DontShowFrptoken">
          <n-tag type="info" @click="changeShouFrptoken($event)">
            <template #icon>
              <n-icon :component="Key"/>
            </template>
            查看访问密钥
          </n-tag>
        </div>
        <template v-else>
          <n-tag type="info">
            <template #icon>
              <n-icon :component="AngleRight"/>
            </template>
            访问密钥: {{ frptoken }}
          </n-tag>
        </template>
        <br/>
      </n-card>
      <br/>
      <n-card title="数据报表" size="large">
        <n-space>
          <n-statistic label="剩余流量" tabular-nums>
            <n-number-animation
                ref="TrafficRef"
                :from="0"
                :to="store.getters.get_traffic"
            />
            <template #suffix> GiB</template>
          </n-statistic>
          <n-statistic label="隧道数" tabular-nums>
            <n-number-animation
                ref="ProxiesRef"
                :from="0"
                :to="Proxiesanimation"
            />
            <template #suffix> 条</template>
          </n-statistic>
          <n-statistic label="速度限制" tabular-nums>
            <a>{{ outbound }}<br/>{{ inbound }}</a>
          </n-statistic>
        </n-space>
      </n-card>
      <br/>
      <n-alert title="关于高级功能" type="info">
        若需要 Frp 的高级功能, 你可以配置隧道后前往软件下载页面，
        进入 LoCyanFrp-0.5X.X 的文件夹，下载适合自己系统架构的软件，随后即可自行配置。<br/>
        注意：萌新使用此方法导致不会用的后果自行承担！<br/>
      </n-alert>
      <n-divider/>
      <n-alert title="注意事项" type="warning">
        1. 若因为自己的迷幻操作导致的各种问题我们没有义务给予回答；<br/>
        2. 不要因为群里没有人回答你的问题而到处宣扬我们没素质，
        在诋毁我们之前请你想想你自身有没有做到自己该做的事情；<br/>
        3. 我们是公益性的服务，不要把我们和某花的服务进行比较，
        免费的服务无法保障稳定性等各方面的问题，
        若有这方面的需求希望你可以购买专业服务器搭建服务；<br/>
        4. 我们承诺：我们留存的用户数据全部采用业内标准的加密格式，
        而我们的数据库也采用异地的方式，我们不会拿用户的个人隐私数据开玩笑，
        某些说我们盗取用户数据的人，也请你们说话过过脑子，
        不要错误引导其他用户；<br/>
        5. 不准搭建关于赌博、黄色、血腥、暴力、爆破、发包、代刷网，
        发卡网等有违中国法律的站点或服务。一经发现，
        我们有不在事先通知用户的情况下删除隧道、封停账户、将信息上报公安的权力，
        请不要试图挑战我们的底线；<br/>
        6. 我们允许建设图床、网盘等服务，但其必须建设在美国千兆服务器上，
        违规的隧道将会被强制迁移，这是为了保障大部分用户的体验，谢谢配合！<br/>
      </n-alert>
    </n-grid-item>
    <n-grid-item span="0:3 600:2">
      <n-card title="公告" size="large">
        <n-spin :show="boardcast_show">
          <n-text v-html="boardcast_html" id="boardrcast"></n-text>
        </n-spin>
        <br/>
      </n-card>
      <br/>
      <n-card title="使用方法">
        <n-space vertical>
          <n-steps vertical :current=7>
            <n-step
                title="创建隧道"
                description="点击隧道操作中的创建隧道，填写自己隧道的相应信息"
            />
            <n-step
                title="软件下载"
                description="点击软件下载（首选备用站点），进入 WPFApp，下载最新版本"
            />
            <n-step
                title="启动客户端"
                description="以管理员身份启动客户端，选择登录自己的账号"
            />
            <n-step
                title="启动隧道"
                description="启动你的隧道即可"
            />
            <n-step
                title="启动成功"
                description="第一次启动请查看自己的日志文件，不要关闭命令行窗口哦"
            />
            <n-step title="开始使用" description="好了，开始享受吧"/>
          </n-steps>
        </n-space>
        <br/>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup>
import {ref} from "vue";
import clipboard from "..//utils/clipboard";
import {get} from "../utils/request.js";
import {AngleRight, Key} from "@vicons/fa";
import store from "../utils/stores/store.js";
import {marked} from "marked";

localStorage.setItem("ViewPage", "personality");
const username = store.getters.get_username;
const email = store.getters.get_email;
const inbound = ref(store.getters.get_in_bound + "Mbps 下行");
const outbound = ref(store.getters.get_out_bound + "Mbps 上行");
const frptoken = store.getters.get_frp_token;
const notice = ref("");
const ProxiesRef = ref(null);
const DontShowFrptoken = ref(true);
const showads = ref(false);
const ads_content = ref("");

const notice_res = get("https://api.locyanfrp.cn/App", []);
notice_res.then((res) => {
  notice.value = res;
  if (notice.value.ads !== "") {
    ads_content.value =
        marked(notice.value.ads) +
        "<style>" +
        '[href^="https"], [href^="http"]{' +
        "  color: #63E2B7;" +
        "p {" +
        "  padding: 2px;" +
        "}" +
        "</style>";
    showads.value = true;
  }
});

async function changeShouFrptoken(event) {
  DontShowFrptoken.value = !DontShowFrptoken.value;
  clipboard(frptoken, event);
  setTimeout(() => {
    DontShowFrptoken.value = !DontShowFrptoken.value;
  }, 3000);
}

const traffic = ref(Number(localStorage.getItem("traffic")) / 1024 + "GB");
const Proxiesanimation = ref(Number(localStorage.getItem("proxies")));
const TrafficRef = ref(null);
const boardcast_html = ref("");
const boardcast_show = ref(true);
// 公告
const boardcast_request = get("https://api.locyanfrp.cn/App/GetBroadCast", []);
boardcast_request.then((res) => {
  if (res.status === true) {
    boardcast_html.value =
        marked(res.broadcast) +
        "<style>\n" +
        '[href^="https"], [href^="http"]{\n' +
        "  color: #63E2B7;\n" +
        "}\n" +
        "\n" +
        "p {\n" +
        "  padding: 2px;\n" +
        "}\n" +
        "\n" +
        "</style>";
    boardcast_show.value = false;
  }
});

function howtosayhi() {
    const currentHour = new Date().getHours();
    switch (currentHour) {
        case 4:
        case 5:
            return '清晨好';
        case 6:
        case 7:
        case 8:
        case 9:
            return '早上好';
        case 10:
        case 11:
        case 12:
            return '中午好';
        case 13:
        case 14:
        case 15:
            return '下午好';
        case 16:
        case 17:
        case 18:
            return '傍晚好';
        case 19:
        case 20:
        case 21:
        case 22:
        case 23:
            return '晚上好';
        case 0:
        case 1:
        case 2:
        case 3:
            return '凌晨好';
        default:
            return '你好';
    }
}


setInterval(() => {
  Proxiesanimation.value = Number(localStorage.getItem("proxies"));
  traffic.value = Number(localStorage.getItem("traffic")) / 1024 + "GB";
  inbound.value = store.getters.get_in_bound + "Mbps 下行";
  outbound.value = store.getters.get_out_bound + "Mbps 上行";
}, 10000);
</script>
