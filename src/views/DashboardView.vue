<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-compass"></i>
    <n-text type="primary"> 仪表盘</n-text>
  </n-h1>
  <n-grid :y-gap="3" :x-gap="20" cols="3" item-responsive>
    <!--<n-grid-item span="3">
      <n-card title="赞助商广告">
      </n-card>
      <br />
    </n-grid-item>-->
    <n-grid-item span="0:3 600:1">
      <n-card title="个人信息" size="medium">
        <span>{{ username }}，{{ howtosayhi() }}</span>
        <br />
        <span>您的邮箱为：{{ email }}</span>
        <br />
        访问密钥：
        <br />
        <div>
          <div v-if="notShowFrpToken" style="display: inline">
            <n-tag type="info" @click="changeShowFrpToken" style="padding: 16px">
              <template #icon>
                <n-icon :component="Key" />
              </template>
              点击显示
            </n-tag>
          </div>
          <template v-else style="display: inline">
            <n-tag type="info" style="padding: 16px">
              <template #icon>
                <n-icon :component="AngleRight" />
              </template>
              {{ frpToken }}
            </n-tag>
          </template>
          <n-button
            style="margin-left: 10px; transform: translateY(-5px)"
            type="info"
            v-clipboard="() => frpToken"
            v-clipboard:success="() => sendSuccessMessage('复制成功')"
            v-clipboard:error="() => sendErrorMessage('复制失败')"
          >
            复制
          </n-button>
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
              src="https://apac-cloudflare-r2-img.1l1.icu/2024/07/03/6685745b965eb.webp"
            />
          </a>
        </n-space>
      </n-card>
      <br />
      <n-card title="数据报表" size="large">
        <n-space>
          <n-statistic label="剩余流量" tabular-nums>
            <n-number-animation ref="TrafficRef" :from="0" :to="userData.getters.get_traffic" />
            <template #suffix> GiB</template>
          </n-statistic>
          <n-statistic label="速度限制" tabular-nums>
            <span>{{ outbound }}<br />{{ inbound }}</span>
          </n-statistic>
        </n-space>
        <!-- API: https://api-v2.locyanfrp.cn/api/v2/users/reset/traffic -->
        <!-- 需要传入Params: username -->
        <span>流量太多, 用不完?</span>
        <n-button @click="resetTraffic" style="margin-left: 20px; margin-top: 10px">
          重置流量
        </n-button>
      </n-card>
      <!--
      <br />
      <n-alert title="关于高级功能" type="info">
        若需要 Frp 的高级功能, 你可以配置隧道后前往此处下载纯净版 Frp ：
        <a href="https://github.com/LoCyan-Team/LoCyanFrpPureApp/releases" target="_blank">
          点击前往 </a
        >，<br />
        下载适合自己系统架构的软件，随后即可自行配置。<br />
        注意：萌新使用此方法导致不会用的后果自行承担！<br />
      </n-alert>
      -->
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
        6. 我们允许建设图床、网盘等服务，但其必须建设在允许大流量业务的节点上，
        违规的隧道将会被封禁，这是为了保障大部分用户的体验，谢谢配合！
        若您违规使用，可能需要支付相应的流量费用！<br />
      </n-alert>
    </n-grid-item>
    <n-grid-item span="0:3 600:2">
      <n-card title="公告" size="large">
        <n-spin :show="broadcastLoading">
          <n-text v-html="broadcastHtml" id="boardrcast"></n-text>
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
// import clipboard from '@/utils/clipboard'
import { AngleRight, Key } from '@vicons/fa'
import userData from '@/utils/stores/userData/store'
import { useDialog, useMessage } from 'naive-ui'
import { startLoadingBar, finishLoadingBar, errorLoadingBar } from '@/utils/loadingbar'
import { sendSuccessMessage, sendErrorMessage } from '@/utils/message'
import api from '@/api'
import logger from '@/utils/logger'
import notice from '@/utils/notice'

localStorage.setItem('ViewPage', 'personality')
const username = userData.getters.get_username
const email = userData.getters.get_email
const inbound = ref(userData.getters.get_user_inbound + 'Mbps 下行')
const outbound = ref(userData.getters.get_user_outbound + 'Mbps 上行')
const frpToken = ref(userData.getters.get_frp_token)
const proxiesRef = ref(null)
const notShowFrpToken = ref(true)
const dialog = useDialog()
const message = useMessage()

const broadcastHtml = ref('')
const broadcastLoading = ref(true)

onMounted(async () => {
  let result = await notice.getNotice()
  broadcastHtml.value = result.broadcast
  broadcastLoading.value = false
})

async function changeShowFrpToken() {
  notShowFrpToken.value = !notShowFrpToken.value
  setTimeout(() => {
    notShowFrpToken.value = !notShowFrpToken.value
  }, 3000)
}

const traffic = ref(Number(localStorage.getItem('traffic')) / 1024 + 'GB')
const TrafficRef = ref(null)

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
      startLoadingBar()
      const data = {
        username: userData.getters.get_username
      }
      let rs
      try {
        rs = await api.v2.user.traffic(data.username)
      } catch (e) {
        logger.error(e)
        sendErrorMessage('请求重置流量失败: ' + e)
      }
      if (!rs) {
        errorLoadingBar()
        return
      }
      if (rs.status === 200) {
        message.success('重置成功!')
      } else {
        message.error('重置失败, API 返回: ' + rs.message)
      }
      finishLoadingBar()
    }
  })
}

setInterval(() => {
  Proxiesanimation.value = Number(userData.getters.get_proxies_num)
  traffic.value = Number(localStorage.getItem('traffic')) / 1024 + 'GB'
  inbound.value = userData.getters.get_user_inbound + 'Mbps 下行'
  outbound.value = userData.getters.get_user_outbound + 'Mbps 上行'
  frpToken.value = userData.getters.get_frp_token
}, 10000)
</script>
