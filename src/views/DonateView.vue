<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-money-bag"></i>
    <n-text type="primary"> 赞助</n-text>
  </n-h1>
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
      title="感谢您的赞助！"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-p>用户名：{{ userData.getters.get_username }}</n-p>
      <n-p>邮箱：{{ userData.getters.get_email }}</n-p>
      <n-p>商品名：{{ trade_info.trade_name }}</n-p>
      <n-p>捐赠订单号：{{ trade_no }}</n-p>
      <n-p>捐赠方式：{{ trade_info.type }}</n-p>
      <n-p>捐赠金额：{{ trade_info.amount }}</n-p>
      <n-p>捐赠时间：{{ timestampToTime(trade_info.time) }}</n-p>
      <br />
      <n-p>
        您可以在该页面放置你的留言，同时你可以保存以下链接便于您修改你的留言（赞助数额小于 3
        元留言不公开）：
      </n-p>
      <n-p>https://dashboard.locyanfrp.cn/donate?out_trade_no={{ trade_no }}</n-p>
      <template #footer>
        <n-button @click="showModal = false"> 关闭</n-button>
      </template>
    </n-card>
  </n-modal>
  <n-grid cols="1" :y-gap="3">
    <n-grid-item span="1" v-if="!showMessageLabel">
      <n-text>选择支付方式</n-text>
      <br />
      <br />
      <n-radio-group v-model:value="pay_type" name="支付方式" :default-value="default_pay_type">
        <n-space>
          <n-radio
            v-for="pay_type_info in payments"
            :key="pay_type_info.value"
            :value="pay_type_info.value"
          >
            {{ pay_type_info.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
      <br />
      <br />
      <n-input type="text" v-model:value="amount" placeholder="金额" />
      <br />
      <br />
      <n-text>
        赞助数额达到 <b> {{ amount_filter_threshold }} 元 </b> 的留言会被公开展示
      </n-text>
      <br />
      <br />
      <n-button @click="doDonate" :loading="loading_donate"> 赞助</n-button>
    </n-grid-item>
    <n-grid-item span="1" v-if="showMessageLabel">
      <n-form
        ref="formRef"
        :model="message"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="medium"
      >
        <n-form-item label="留言" path="message">
          <n-input type="text" v-model:value="message.message" placeholder="赞助的留言" />
        </n-form-item>
        <n-space>
          <n-button
            type="primary"
            style="margin-right: 10px"
            @click="submitMessage"
            :loading="loading_submit"
          >
            提交
          </n-button>
        </n-space>
      </n-form>
    </n-grid-item>
  </n-grid>
  <br />
  <n-spin :show="loadingDonateList">
    <n-grid cols="3" item-responsive :x-gap="12" :y-gap="12">
      <n-grid-item
        v-for="item in donateList
          .filter((element) => element.amount >= amount_filter_threshold)
          .sort((left, right) => right.time - left.time)
          .slice(0, display_all_messages ? undefined : display_messages_default)"
        span="0:3 950:1"
      >
        <n-space style="display: block">
          <n-card>
            <n-space>
              <n-gradient-text type="primary">
                {{ item.username }}
              </n-gradient-text>
              <n-gradient-text type="warning">
                {{ item.amount }} <i class="twa twa-yen-banknote"></i>
              </n-gradient-text>
            </n-space>
            <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
              {{ item.message }}
            </n-ellipsis>

            <template #footer>
              {{ timestampToTime(item.time) }}
            </template>
          </n-card>
        </n-space>
      </n-grid-item>
    </n-grid>
    <br />
    <n-button
      @click="
        () => {
          display_all_messages = !display_all_messages
        }
      "
    >
      {{ display_all_messages ? '折叠部分留言' : '展开全部留言' }}
    </n-button>
  </n-spin>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getUrlKey } from '@/utils/request'
import userData from '@/utils/stores/userData/store'
import { sendErrorMessage } from '@/utils/message'
import { sendSuccessDialog, sendWarningDialog } from '@/utils/dialog'
import api from '@/api'

// 页面元素初始化
const amount = ref('0.01')
const amount_filter_threshold = ref(3.0)
const trade_no = getUrlKey('out_trade_no')
const showMessageLabel = ref(false)
const showModal = ref(false)
const loadingDonateList = ref(true)
const display_messages_default = ref(5)
const display_all_messages = ref(false)
const trade_info = ref({
  id: 1,
  username: '',
  message: null,
  trade_name: '',
  trade_no: '',
  type: '',
  amount: '',
  time: '',
  status: 0
})
const default_pay_type = 'alipay'
const payments = ref([
  {
    label: '支付宝',
    value: 'alipay'
  }
])
const pay_type = ref('')

onMounted(async () => {
  if (trade_no !== null) {
    showMessageLabel.value = true
    showModal.value = true
    let rs
    try {
      rs = await api.v1.Donate.GetDonateInfo(trade_no)
    } catch (e) {
      sendErrorMessage('请求列表失败: ' + e)
    }
    if (!rs) return
    if (rs.status === 200) {
      if (rs.data) trade_info.value = rs.data
      else sendErrorMessage('返回数据无效')
    } else {
      sendErrorMessage(rs.message)
    }
  }
})
const loading_submit = ref(false)
const loading_donate = ref(false)
const formRef = ref(null)
const message = ref([
  {
    message: ''
  }
])

const donateList = ref([])
async function getDonateList() {
  let rs
  try {
    rs = await api.v1.Donate.GetDonateList()
  } catch (e) {
    sendErrorMessage('请求列表失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    donateList.value = rs.data
    loadingDonateList.value = false
  } else {
    sendErrorMessage(rs.message)
  }
}

getDonateList()

const timestampToTime = (timestamp) => {
  const date = new Date(timestamp * 1000)
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  const h = date.getHours() + ':'
  const m = date.getMinutes() + ':'
  const s = date.getSeconds()
  return Y + M + D + h + m + s
}

async function submitMessage() {
  loading_submit.value = true
  if (message.message === '') {
    sendWarningDialog('内容不能为空！')
    loading_submit.value = false
    return
  }

  let rs
  try {
    rs = await api.v1.Donate.SetMessage(
      userData.getters.get_username,
      userData.getters.get_token,
      trade_no,
      message.value.message
    )
  } catch (e) {
    sendErrorMessage('请求列表失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    if (rs.data.status) {
      sendSuccessDialog(rs.message)
      getDonateList()
    } else {
      sendWarningDialog(rs.message)
      loading_submit.value = false
    }
    loading_submit.value = false
  } else {
    sendWarningDialog(rs.message)
    loading_submit.value = false
  }
}

async function doDonate() {
  loading_donate.value = true
  if (pay_type.value === '' || pay_type.value === null) {
    sendWarningDialog('请选择支付方式')
    loading_donate.value = false
    return
  }
  let rs
  try {
    rs = await api.v2.donate.root.post(
      userData.getters.get_username,
      amount.value
    )
  } catch (e) {
    sendErrorMessage('请求列表失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    window.open(rs.data.url)
    loading_donate.value = false
  } else {
    sendWarningDialog(rs.message)
    loading_donate.value = false
  }
}
</script>
