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
      <n-p>用户名：{{ store.getters.get_username }}</n-p>
      <n-p>邮箱：{{ store.getters.get_email }}</n-p>
      <n-p>商品名：{{ trade_info.trade_name }}</n-p>
      <n-p>捐赠订单号：{{ trade_no }}</n-p>
      <n-p>捐赠方式：{{ trade_info.type }}</n-p>
      <n-p>捐赠金额：{{ trade_info.amount }}</n-p>
      <n-p>捐赠时间：{{ timestampToTime(trade_info.time) }}</n-p>
      <br/>
      <n-p
      >您可以在该页面放置你的留言，同时你可以保存以下链接便于您修改你的留言（赞助数额小于 3 元留言不公开）：
      </n-p
      >
      <n-p>https://preview.locyanfrp.cn/donate?out_trade_no={{ trade_no }}</n-p>
      <template #footer>
        <n-button @click="showModal = false"> 关闭</n-button>
      </template>
    </n-card>
  </n-modal>
  <n-grid cols="1" :y-gap="3">
    <n-grid-item span="1" v-show="!ShowMessageLabel">
      <n-text>选择支付方式</n-text>
      <br/>
      <br/>
      <n-radio-group
          v-model:value="pay_type"
          name="支付方式"
          :default-value="default_pay_type"
      >
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
      <br/>
      <br/>
      <n-input type="text" v-model:value="amount" placeholder="金额"/>
      <br/>
      <br/>
      <n-text>赞助数额达到 <b> {{ amount_filter_threshold }} 元 </b> 的留言会被公开展示</n-text>
      <br/>
      <br/>
      <n-button @click="DoDonate" :loading="loading_donate"> 赞助</n-button>
    </n-grid-item>
    <n-grid-item span="1" v-show="ShowMessageLabel">
      <n-form
          ref="formRef"
          :model="message"
          label-width="auto"
          require-mark-placement="right-hanging"
          size="medium"
      >
        <n-form-item label="留言" path="message">
          <n-input
              type="text"
              v-model:value="message.message"
              placeholder="赞助的留言"
          />
        </n-form-item>
        <n-space>
          <n-button
              type="primary"
              style="margin-right: 10px"
              @click="submit"
              :loading="loading_submit"
          >
            提交
          </n-button>
        </n-space>
      </n-form>
    </n-grid-item>
  </n-grid>
  <br/>
  <n-spin :show="LoadingDonateList">
    <n-grid cols="3" item-responsive :x-gap="12" :y-gap="12">
      <n-grid-item
          v-for="item in DonateList.filter(element => element.amount >= amount_filter_threshold).sort((left, right) => right.time - left.time).slice(0, display_all_messages ? undefined : display_messages_default)"
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
    <br/>
    <n-button @click="() => { display_all_messages = !display_all_messages; }">
      {{ display_all_messages ? "折叠部分留言" : "展开全部留言" }}
    </n-button>
  </n-spin>
</template>

<script setup>
import {ref} from "vue";
import {get, getUrlKey, post} from "../utils/request.js";
import store from "../utils/stores/store.js";
import {SendSuccessDialog, SendWarningDialog} from "../utils/dialog.js";

// 页面元素初始化
const amount = ref("0.01");
const amount_filter_threshold = ref(3.00);
const trade_no = getUrlKey("out_trade_no");
const ShowMessageLabel = ref(false);
const showModal = ref(false);
const LoadingDonateList = ref(true);
const display_messages_default = ref(5);
const display_all_messages = ref(false);
const trade_info = ref({
  id: 1,
  username: "",
  message: null,
  trade_name: "",
  trade_no: "",
  type: "",
  amount: "",
  time: "",
  status: 0,
});
const default_pay_type = "alipay";
const payments = ref([
  {
    label: "支付宝",
    value: "alipay",
  },
]);
const pay_type = ref("");

if (trade_no !== null) {
  ShowMessageLabel.value = true;
  showModal.value = true;
  const trade_res = get(
      "https://api.locyanfrp.cn/donate/GetDonateInfo?trade_no=" + trade_no,
      []
  );
  trade_res.then((res) => {
    trade_info.value = res;
  });
}
const loading_submit = ref(false);
const loading_donate = ref(false);
const formRef = ref(null);
const message = ref([
  {
    message: "",
  },
]);

const DonateList = ref([]);
const GetDonateList = () => {
  const DonateList_res = get(
      "https://api.locyanfrp.cn/Donate/GetDonateList",
      []
  );
  DonateList_res.then((res) => {
    DonateList.value = res;
    LoadingDonateList.value = false;
  });
};

GetDonateList();

const timestampToTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const Y = date.getFullYear() + "-";
  const M =
      (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
  const D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  const h = date.getHours() + ":";
  const m = date.getMinutes() + ":";
  const s = date.getSeconds();
  return Y + M + D + h + m + s;
};

const submit = () => {
  loading_submit.value = true;
  if (message.message === "") {
    SendWarningDialog("内容不能为空！");
    loading_submit.value = false;
    return;
  }

  const rs = get(
      "https://api.locyanfrp.cn/donate/SetMessage?username=" +
      store.getters.get_username +
      "&token=" +
      store.getters.get_token +
      "&trade_no=" +
      trade_no +
      "&message=" +
      message.value.message,
      []
  );
  rs.then((res) => {
    if (res.status === true) {
      SendSuccessDialog(res.message);
      GetDonateList();
      loading_submit.value = false;
    } else {
      SendWarningDialog(res.message);
      loading_submit.value = false;
    }
  });
};

const DoDonate = () => {
  loading_donate.value = true;
  if (pay_type.value === "" || pay_type.value === null) {
    SendWarningDialog("请选择支付方式");
    loading_donate.value = false;
    return;
  }
  const rs = post("https://api-v2.locyanfrp.cn/api/v2/donate/create", {
    "name": "LoCyanFrpDonate",
    "money": amount.value,
    "redirect_url": "https://preview.locyanfrp.cn/donate",
    "notify_url": "https://api-v2.locyanfrp.cn/api/v2/donate/notify",
    "username": store.getters.get_username
  });
  rs.then((res) => {
    if (res.status === 200) {
      window.open(res.data.url);
      loading_donate.value = false;
    } else {
      SendWarningDialog(res.data.msf);
      loading_donate.value = false;
    }
  });
};
</script>
