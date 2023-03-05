<template>
  <n-h1 prefix="bar" style="margin-top: 30px;">
    <n-text type="primary">
      赞助
    </n-text>
  </n-h1>
  <n-modal v-model:show="showModal">
    <n-card
        style="width: 600px"
        title="感谢您的捐助！"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
      <p>用户名: {{ store.getters.GetUserName }}</p>
      <p>邮箱：{{ store.getters.GetEmail }}</p>
      <p>商品名： {{ trade_info.trade_name }}</p>
      <p>捐赠订单号：{{ trade_no }}</p>
      <p>捐赠方式：{{ trade_info.type }}</p>
      <p>捐赠金额: {{ trade_info.amount }}</p>
      <p>捐赠时间：{{ timestampToTime(trade_info.time) }}</p>
      <br />
      <p>您可以在该页面放置你的留言，同时你可以保存以下url便于您修改你的留言</p>
      <p>https://preview.locyanfrp.cn/donate?trade_no={{ trade_no }}</p>
      <template #footer>
        <n-button @click="showModal=false;"> 关闭 </n-button>
      </template>
    </n-card>
  </n-modal>
  <n-grid cols="1" :y-gap="3">
    <n-grid-item span="1" v-show="!ShowMessageLabel">
      <n-text>选择支付方式</n-text>
      <br />
      <br />
      <n-radio-group v-model:value="pay_type" name="支付方式" :default-value="default_pay_type">
        <n-space>
          <n-radio v-for="pay_type_info in payments" :key="pay_type_info.value" :value="pay_type_info.value">
            {{ pay_type_info.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
      <br />
      <br />
      <n-input type="text" v-model:value="amount" placeholder="金额"/>
      <br />
      <br />
      <n-button @click="DoDonate" :loading="loading_donate"> 赞助 </n-button>
    </n-grid-item>
    <n-grid-item span="1" v-show="ShowMessageLabel">
      <n-form ref="formRef" :model="message" label-width="auto" require-mark-placement="right-hanging" size="medium">
        <n-form-item label="留言" path="message">
          <n-input type="text" v-model:value="message.message" placeholder="赞助的留言"/>
        </n-form-item>
        <n-space>
          <n-button type="primary" style="margin-right: 10px;" @click="submit" :loading="loading_submit"> 提交 </n-button>
        </n-space>
      </n-form>
    </n-grid-item>
  </n-grid>
  <br />
  <n-spin :show="LoadingDonateList">
    <n-grid cols="3" item-responsive>
      <n-grid-item v-for="item in DonateList" span="0:3 950:1">
        <n-space style="display: block;">
          <n-card :title="item.username + ' [ ' + item.amount + '人民币 ] '">
            {{ item.message }}
            <template #footer>
              提交时间：{{ timestampToTime(item.time) }}
            </template>
          </n-card>
        </n-space>
      </n-grid-item>
    </n-grid>
  </n-spin>
</template>

<script setup>
import { ref } from "vue";
import { NFormItem, NForm, NInput, NButton, NGrid, NGridItem, NSpace, NModal, NH1, NText, NCard, NSpin, NRadioGroup, NRadio } from "naive-ui";
import { get, getUrlKey } from "../utils/request.js";
import store from "../utils/store.js";
import { SendSuccessDialog, SendWarningDialog } from "../utils/dialog.js";

// 页面元素初始化
const amount = ref("0.01");
const trade_no = getUrlKey("out_trade_no");
const ShowMessageLabel = ref(false);
const showModal = ref(false);
const LoadingDonateList = ref(true);
const trade_info = ref({
  "id": 1,
  "username": "",
  "message": null,
  "trade_name": "",
  "trade_no": "",
  "type": "",
  "amount": "",
  "time": "",
  "status": 0
});
const default_pay_type = "alipay";
const payments = ref([
    {
      "label": "支付宝",
      "value": "alipay"
    }
]);
const pay_type = ref("");

if (trade_no !== null){
  ShowMessageLabel.value = true;
  showModal.value = true;
  const trade_res = get("https://api.locyanfrp.cn/donate/GetDonateInfo?trade_no=" + trade_no, [])
  trade_res.then(res => {
    trade_info.value = res;
  })
}
const loading_submit = ref(false);
const loading_donate = ref(false);
const formRef = ref(null);
const message = ref([
  {
    message: ""
  }
]);

const DonateList = ref([]);
const GetDonateList = () => {
  const DonateList_res = get("https://api.locyanfrp.cn/Donate/GetDonateList", [])
  DonateList_res.then(res => {
    DonateList.value = res;
    LoadingDonateList.value = false;
  })
}

GetDonateList();

const timestampToTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const Y = date.getFullYear() + "-";
  const M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
  const D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  const h = date.getHours() + ":";
  const m = date.getMinutes() + ":";
  const s = date.getSeconds();
  return Y + M + D + h + m + s;
}

const submit = () => {
  loading_submit.value = true;
  if (message.message === ""){
    SendWarningDialog("内容不能为空！")
    loading_submit.value = false;
    return;
  }

  const rs = get("https://api.locyanfrp.cn/donate/SetMessage?username=" + store.getters.GetUserName + "&token=" + store.getters.GetToken + "&trade_no=" + trade_no + "&message=" + message.value.message, []);
  rs.then(res => {
    if (res.status === true){
      SendSuccessDialog(res.message);
      GetDonateList();
      loading_submit.value = false;
    } else {
      SendWarningDialog(res.message);
      loading_submit.value = false;
    }
  })
};

const DoDonate = () => {
  loading_donate.value = true;
  if (pay_type.value === "" || pay_type.value === null){
    SendWarningDialog("请选择支付方式");
    loading_donate.value = false;
    return;
  }
  const rs = get("https://api.locyanfrp.cn/Pay?money=" + amount.value + "&name=LoCyanFrp Donate&username=" + store.getters.GetUserName + "&type=" + pay_type.value + "&return_url=https://preview.locyanfrp.cn/donate", []);
  rs.then(res => {
    if (res.status === true){
      window.open(res.url);
      loading_donate.value = false;
    } else {
      SendWarningDialog(res.message);
      loading_donate.value = false;
    }
  })
}


</script>