<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-money-bag"></i>
    <n-text type="success"> 赞助</n-text>
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
      <n-p>商品名：{{ tradeInfo.trade_name }}</n-p>
      <n-p>捐赠订单号：{{ inputTradeNo }}</n-p>
      <n-p>捐赠方式：{{ tradeInfo.type }}</n-p>
      <n-p>捐赠金额：{{ tradeInfo.amount }}</n-p>
      <n-p>捐赠时间：{{ timestampToTime(tradeInfo.time) }}</n-p>
      <br />
      <n-p>
        您可以在该页面放置你的留言，同时你可以保存以下链接便于您修改你的留言（赞助数额小于 3
        元留言不公开）：
      </n-p>
      <n-p>https://dashboard.locyanfrp.cn/donate?out_trade_no={{ inputTradeNo }}</n-p>
      <template #footer>
        <n-button @click="showModal = false"> 关闭</n-button>
      </template>
    </n-card>
  </n-modal>
  <n-card title="赞助">
    <n-grid cols="1" :y-gap="3">
      <n-grid-item span="1" v-if="!showMessageLabel">
        <n-text>选择支付方式</n-text>
        <br />
        <br />
        <n-radio-group v-model:value="payType" name="支付方式">
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
          赞助数额达到 <b> {{ amountFilterThreshold }} 元 </b> 的留言会被公开展示
        </n-text>
        <br />
        <br />
        <n-button type="success" @click="doDonate" :loading="donateLoading"> 赞助</n-button>
      </n-grid-item>
      <n-grid-item span="1" v-if="showMessageLabel">
        <n-form
          ref="formRef"
          :model="donateMessage"
          label-width="auto"
          require-mark-placement="right-hanging"
          size="medium"
        >
          <n-form-item label="留言" path="message">
            <n-input type="text" v-model:value="donateMessage.message" placeholder="赞助的留言" />
          </n-form-item>
          <n-space>
            <n-button
              type="success"
              style="margin-right: 10px"
              @click="submitMessage"
              :loading="submitLoading"
            >
              提交
            </n-button>
          </n-space>
        </n-form>
      </n-grid-item>
    </n-grid>
  </n-card>
  <n-h3>留言</n-h3>
  <n-spin :show="donateListLoading">
    <n-empty v-if="donateList.length === 0"></n-empty>
    <n-grid v-else cols="3" item-responsive :x-gap="12" :y-gap="12">
      <n-grid-item
        v-for="item in donateList
          .filter((element) => element.amount >= amountFilterThreshold)
          .sort((left, right) => right.time - left.time)
          .slice(0, displayAllMessages ? undefined : displayMessagesDefault)"
        span="0:3 950:1"
      >
        <n-space style="display: block">
          <n-card>
            <n-space>
              <n-gradient-text type="success">
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
      v-if="donateList.length !== 0"
      @click="
        () => {
          displayAllMessages = !displayAllMessages
        }
      "
    >
      {{ displayAllMessages ? '折叠部分留言' : '展开全部留言' }}
    </n-button>
  </n-spin>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getUrlKey } from '@/utils/request'
import userData from '@/utils/stores/userData/store'
import Message from '@/utils/message'
import Dialog from '@/utils/dialog'
import logger from '@/utils/logger'
import api from '@/api'

const message = new Message()
const dialog = new Dialog()

// 页面元素初始化
const amount = ref('0.01')
const amountFilterThreshold = ref(3.0)
const inputTradeNo = getUrlKey('out_trade_no')
const showMessageLabel = ref(false)
const showModal = ref(false)
const donateListLoading = ref(true)
const displayMessagesDefault = ref(5)
const displayAllMessages = ref(false)
const tradeInfo = ref({
  id: 1,
  message: null,
  trade_name: '',
  trade_no: '',
  type: '',
  amount: '',
  time: '',
  status: 0
})
const payments = ref([
  {
    label: '支付宝',
    value: 'alipay'
  }
])
const payType = ref('alipay')

onMounted(async () => {
  if (inputTradeNo !== null) {
    showMessageLabel.value = true
    showModal.value = true
    let rs
    try {
      rs = await api.v2.donate.info(userData.getters.get_user_id, inputTradeNo)
    } catch (e) {
      logger.error(e)
      message.error('请求列表失败: ' + e)
    }
    if (!rs) return
    if (rs.status === 200) {
      tradeInfo.value = rs.data
    } else {
      message.error(rs.message)
    }
  }
})
const submitLoading = ref(false)
const donateLoading = ref(false)
const formRef = ref(null)
const donateMessage = ref([
  {
    message: ''
  }
])

const donateList = ref([])
async function getDonateList() {
  let rs
  try {
    rs = await api.v2.donate.say.all()
  } catch (e) {
    message.error('请求列表失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    donateList.value = rs.data.list
    donateListLoading.value = false
  } else {
    message.error(rs.message)
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
  submitLoading.value = true
  if (donateMessage.message === '') {
    message.warning('内容不能为空！')
    submitLoading.value = false
    return
  }

  let rs
  try {
    rs = await api.v2.donate.say.root.post(
      userData.getters.get_user_id,
      inputTradeNo,
      donateMessage.value.message
    )
  } catch (e) {
    logger.error(e)
    message.error('请求列表失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    message.success('提交成功，感谢您的赞助~')
    getDonateList()
    submitLoading.value = false
  } else {
    message.warning(rs.message)
    submitLoading.value = false
  }
}

async function doDonate() {
  donateLoading.value = true
  if (payType.value === '' || payType.value === null) {
    message.error('请选择支付方式')
    donateLoading.value = false
    return
  }
  let rs
  try {
    rs = await api.v2.donate.root.post(userData.getters.get_user_id, amount.value)
  } catch (e) {
    logger.error(e)
    message.error('请求列表失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    window.open(rs.data.url)
    donateLoading.value = false
  } else {
    message.error(rs.message)
    donateLoading.value = false
  }
}
</script>
