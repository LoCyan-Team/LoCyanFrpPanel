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
      指挥官，您好!
      <br />
      <i class="twa twa-bell"></i> 通知：{{ notice.contents }}
    </n-alert>
  </template>
  <template v-else>
    <n-alert title="" type="info" closable>
      <template #icon>
        <i class="twa twa-hibiscus"></i>
      </template>
      <n-skeleton text :repeat="2" style="width: 50%" />
    </n-alert>
  </template>
  <br />
  <n-grid :y-gap="3" :x-gap="20" cols="3" item-responsive>
    <!--<n-grid-item span="3">
      <n-card title="赞助商广告">
      </n-card>
      <br />
    </n-grid-item>-->
    <n-grid-item span="0:3 600:1">
      <n-card title="个人信息" size="medium">
        <a
          >您好，尊敬的 <a id="username">{{ username }}</a></a
        >
        <br />
        <a>您的邮箱为：{{ email }}</a>
        <br />
        访问密钥：
        <br />
        <div>
          <div v-if="notShowFrpToken">
            <n-tag type="info" @click="changeShowFrptoken($event)">
              <template #icon>
                <n-icon :component="Key" />
              </template>
              点击显示
            </n-tag>
          </div>
          <template v-else>
            <n-tag type="info">
              <template #icon>
                <n-icon :component="AngleRight" />
              </template>
              {{ frptoken }}
            </n-tag>
          </template>
        </div>
        请妥善保管访问密钥，一旦该密钥泄露，他人可通过此密钥访问账户部分信息！
        <br />
      </n-card>
      <br />
      <n-card title="赞助商广告" size="large">
        <n-space>
          <a href="https://spcraft.cn" target="_blank">
            <img
              style="width: 100%"
              src="https://apac-cloudflare-r2.img.1l1.icu/2024/07/03/6685745b965eb.webp"
            />
          </a>
        </n-space>
      </n-card>
      <br />
      <n-card title="数据报表" size="large">
        <n-space>
          <n-statistic label="剩余流量" tabular-nums>
            <n-number-animation ref="TrafficRef" :from="0" :to="store.getters.get_traffic" />
            <template #suffix> GiB</template>
          </n-statistic>
          <n-statistic label="隧道数" tabular-nums>
            <n-number-animation ref="proxiesRef" :from="0" :to="Proxiesanimation" />
            <template #suffix> 条</template>
          </n-statistic>
          <n-statistic label="速度限制" tabular-nums>
            <a>{{ outbound }}<br />{{ inbound }}</a>
          </n-statistic>
        </n-space>
        <!-- API: https://api-v2.locyanfrp.cn/api/v2/users/reset/traffic -->
        <!-- 需要传入Params: username -->
        <a>流量太多, 用不完?</a
        ><n-button @click="resetTraffic" style="margin-left: 20px; margin-top: 10px"
          >重置流量</n-button
        >
      </n-card>
      <br />
      <n-alert title="关于高级功能" type="info">
        若需要 Frp 的高级功能, 你可以配置隧道后前往此处下载纯净版 Frp ：
        <a href="https://github.com/LoCyan-Team/LoCyanFrpPureApp/releases" target="_blank"
          >点击前往</a
        >，<br />
        下载适合自己系统架构的软件，随后即可自行配置。<br />
        注意：萌新使用此方法导致不会用的后果自行承担！<br />
      </n-alert>
      <n-divider />
      <n-alert title="注意事项" type="warning">
        1. 若因为自己的迷幻操作导致的各种问题我们没有义务给予回答；<br />
        2.
        不要因为群里没有人回答你的问题而到处宣扬我们没素质，任何人的时间都是宝贵的，不要因为你的问题而去浪费他人的时间。
        在诋毁我们之前请你想想你自身有没有做到自己该做的事情；<br />
        3. 我们是公益性的服务，不要把我们与任何付费的Frp服务商进行比较，
        免费的服务无法保障稳定性等各方面的问题，
        若有这方面的需求希望你可以购买专业服务器搭建服务；<br />
        4. 我们承诺：我们留存的用户数据全部采用业内标准的加密格式，
        而我们的数据库也采用异地的方式，我们不会拿用户的个人隐私数据开玩笑，
        某些说我们盗取用户数据的人，也请你们说话过过脑子， 不要错误引导其他用户；<br />
        5. 不准搭建关于赌博、黄色、血腥、暴力、爆破、发包、代刷网，
        发卡网等有违中国法律的站点或服务。一经发现，
        我们有不在事先通知用户的情况下删除隧道、封停账户、将信息上报公安的权力，
        请不要试图挑战我们的底线；<br />
        6. 我们允许建设图床、网盘等服务，但其必须建设在美国千兆服务器上，
        违规的隧道将会被强制迁移，这是为了保障大部分用户的体验，谢谢配合！
        若您违规使用，可能需要支付相应的流量费用！<br />
      </n-alert>
    </n-grid-item>
    <n-grid-item span="0:3 600:2">
      <n-card title="公告" size="large">
        <n-spin :show="boardcast_show">
          <n-text v-html="boardcast_html" id="boardrcast"></n-text>
        </n-spin>
        <br />
      </n-card>
      <br />
      <n-card title="使用方法">
        <n-space vertical>
          <n-steps vertical :current="8">
            <n-step
              title="创建隧道"
              description="点击隧道操作中的创建隧道，填写自己隧道的相应信息"
            />
            <n-step title="软件下载" description="点击软件下载,下载最新版本" />
            <n-step title="启动客户端" description="启动客户端，登录自己的账号" />
            <n-step title="安装Frpc" description="前往 设置->FRPC->安装Frpc" />
            <n-step title="前往隧道列表" description="返回首页，点击左上角导航按钮，前往隧道列表" />
            <n-step title="启动隧道" description="找到要启动的隧道，点击启动即可" />
            <n-step title="启动成功" description="点击左上角导航按钮，前往控制台，即可查看日志" />
            <n-step title="开始使用" description="好了，开始享受吧" />
          </n-steps>
        </n-space>
        <br />
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import clipboard from '@/utils/clipboard'
import { get } from '@/utils/request'
import { AngleRight, Key } from '@vicons/fa'
import store from '@/utils/stores/store'
import { marked } from 'marked'
import { useDialog, useMessage } from 'naive-ui'
import { StartLoadingBar } from '@/utils/loadingbar'
import { sendWarningMessage, sendErrorMessage } from '@/utils/message.js'
import api from '@/api'

localStorage.setItem('ViewPage', 'personality')
const username = store.getters.get_username
const email = store.getters.get_email
const inbound = ref(store.getters.get_in_bound + 'Mbps 下行')
const outbound = ref(store.getters.get_out_bound + 'Mbps 上行')
const frptoken = ref(store.getters.get_frp_token)
const notice = ref('')
const proxiesRef = ref(null)
const notShowFrpToken = ref(true)
const showads = ref(false)
const ads_content = ref('')
const dialog = useDialog()
const message = useMessage()

// 通知 or AD
onMounted(async () => {
  // console.log('Rquest ads')
  let res;
  try {
    res = await api.v1.App.root()
  } catch (e) {
    sendErrorMessage('获取 Ads 失败: ' + e)
  }
  // console.log(res)
  if (!res) return;
  notice.value = res.data
  if (notice.value.ads !== '') {
    ads_content.value =
      marked(notice.value.ads) +
      '<style>' +
      '[href^="https"], [href^="http"]{' +
      '  color: #63E2B7;' +
      'p {' +
      '  padding: 2px;' +
      '}' +
      '</style>'
    showads.value = true
  }
})

// 公告
onMounted(async () => {
  let res;
  try {
    res = await api.v1.App.GetBroadCast()
  } catch (e) {
    sendErrorMessage('获取 Broadcast 信息失败: ' + e)
  }
  if (!res) return
  if (res.data.status === true) {
    boardcast_html.value =
      marked(res.data.broadcast) +
      '<style>\n' +
      '[href^="https"], [href^="http"]{\n' +
      '  color: #63E2B7;\n' +
      '}\n' +
      '\n' +
      'p {\n' +
      '  padding: 2px;\n' +
      '}\n' +
      '\n' +
      '</style>'
    boardcast_show.value = false
  }
})

async function changeShowFrptoken(event) {
  notShowFrpToken.value = !notShowFrpToken.value
  clipboard(frptoken.value, event)
  setTimeout(() => {
    notShowFrpToken.value = !notShowFrpToken.value
  }, 3000)
}

const traffic = ref(Number(localStorage.getItem('traffic')) / 1024 + 'GB')
const Proxiesanimation = ref(
  Number(store.getters.get_proxies_num || localStorage.getItem('proxies_num'))
)
const TrafficRef = ref(null)
const boardcast_html = ref('')
const boardcast_show = ref(true)

function howtosayhi() {
  const currentHour = new Date().getHours()
  switch (currentHour) {
    case 4:
    case 5:
      return '清晨好'
    case 6:
    case 7:
    case 8:
    case 9:
      return '早上好'
    case 10:
    case 11:
    case 12:
      return '中午好'
    case 13:
    case 14:
    case 15:
      return '下午好'
    case 16:
    case 17:
    case 18:
      return '傍晚好'
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
      return '晚上好'
    case 0:
    case 1:
    case 2:
    case 3:
      return '凌晨好'
    default:
      return '你好'
  }
}

async function resetTraffic() {
  dialog.warning({
    title: '警告',
    content: '确定要重置流量吗？这将将剩余流量设置为 10 GiB',
    positiveText: '确定',
    negativeText: '还是算了~',
    onPositiveClick: async () => {
      StartLoadingBar()
      const data = {
        username: store.getters.get_username
      }
      const rs = await get('https://api-v2.locyanfrp.cn/api/v2/users/reset/traffic', data)
      if (rs.status === 200) {
        message.success('重置成功!')
      } else {
        message.success('重置失败, API 返回: ' + rs.data.msg)
      }
      FinishLoadingBar()
    }
  })
}

setInterval(() => {
  Proxiesanimation.value = Number(store.getters.get_proxies_num)
  traffic.value = Number(localStorage.getItem('traffic')) / 1024 + 'GB'
  inbound.value = store.getters.get_in_bound + 'Mbps 下行'
  outbound.value = store.getters.get_out_bound + 'Mbps 上行'
  frptoken.value = store.getters.get_frp_token
}, 10000)
</script>
