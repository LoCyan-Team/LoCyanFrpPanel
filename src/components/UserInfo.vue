<template>
  <n-drawer v-model:show="show" :width="Width_DiaLog">
    <n-drawer-content title="个人信息" closable>
      <n-avatar round :size="80" :src="store.getters.get_avatar"/>
      <br/>
      <n-text style="font-size: 20px">{{ store.getters.get_username }}
      </n-text
      >
      <br/>
      <n-text style="color: gray"
      >本站使用 Cravatar 公用头像库 API ，可以前往
        <a target="_blank" href="https://cravatar.cn/">Cravatar</a> 或
        <a target="_blank" href="https://gravatar.com/">Gravatar</a>
        修改您的头像
      </n-text
      >
      <br/>
      <n-h2>社交账号绑定</n-h2>
      <n-space>
        <n-h5 style="margin: 3px"> QQ:</n-h5>
        <n-button
            type="info"
            v-bind:disabled="bindQQ.isDisable"
            @click="DoBindQQ"
            :loading="binding"
        >
          {{ bindQQ.msg }}
        </n-button>
        <n-button
            type="error"
            v-bind:disabled="bindQQ.unBindDisable"
            @click="UnBindQQ"
            :loading="binding"
        >
          {{ bindQQ.unBindmsg }}
        </n-button>
      </n-space>
      <n-h2>修改信息</n-h2>
      <n-text style="color: gray"
      >一旦修改信息，您的登录账户也会随之改变！
      </n-text
      >
      <n-space>
        <!--<n-text style="color: gray">一旦修改信息，您的登录账户也会随之改变！</n-text>-->
        <n-h5 style="margin: 3px"> 邮箱：</n-h5>
        <n-input
            v-bind:disabled="tEmail.isEditDisable"
            v-model:value="tEmail.email"
        />
        <n-button
            @click="changeEmail"
            v-bind:disabled="tEmail.isBtnDisable"
            type="info"
        >{{ tEmail.msg }}
        </n-button
        >
        <n-space v-bind:style="tEmail.isEditDisable1">
          <n-input
              v-model:value="tEmail.verify.code"
              style="max-width: 200px"
              placeholder="请输入验证码"
          />
          <n-button
              round
              ghost
              type="primary"
              v-bind:disabled="tEmail.verify.isClick"
              @click="sendChangeEmailCode"
          >{{ tEmail.verify.msg }}
          </n-button
          >
        </n-space>
      </n-space>
      <template #footer>
        <n-button ghost type="primary" @click="DoLogOut">
          退出登录
        </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { logout } from "../utils/profile.js";
import store from "../utils/stores/store.js";
import { sendSuccessMessage } from "../utils/message.js";
import { ref } from "vue";
import { get } from "../utils/request.js";

const username = store.getters.get_username;
const Width_DiaLog = ref("30vw");
const ldb = useLoadingBar();
const message = useMessage();
const binding = ref(false);
if (document.body.clientWidth <= 800) {
  Width_DiaLog.value = "75vw";
}

const bindQQ = ref({
  isDisable: true,
  msg: "正在获取",
  unBindDisable: true,
  unBindmsg: "正在获取",
});

const tEmail = ref({
  email: store.getters.get_email,
  msg: "修改",
  isEditDisable1: "display:none",
  isEditDisable: true,
  isBtnDisable: false,
  verify: {
    isClick: false,
    msg: "获取验证码",
    code: "",
  },
});

function queryBind() {
  const rs = get(
      "https://api.locyanfrp.cn/OAuth/CheckQQIsBind?username=" +
      store.getters.get_username
  );
  rs.then((res) => {
    if (!res.status) {
      bindQQ.value.isDisable = false;
      bindQQ.value.msg = ref("点击绑定");
      bindQQ.value.unBindDisable = true;
      bindQQ.value.unBindmsg = ref("尚未绑定");
    } else {
      bindQQ.value.isDisable = true;
      bindQQ.value.msg = ref("已绑定");
      bindQQ.value.unBindDisable = false;
      bindQQ.value.unBindmsg = ref("解除绑定");
    }
  });
}

console.log("初始化绑定");
queryBind();

function changeEmail() {
  if (tEmail.value.isEditDisable) {
    tEmail.value.isEditDisable = false;
    tEmail.value.isEditDisable1 = ref("");
    tEmail.value.msg = "确认";
  } else if (!tEmail.value.isEditDisable) {
    //换绑
    tEmail.value.isBtnDisable = true;
    const rs = get(
        "https://api.locyanfrp.cn/Account/EditEmail?username=" +
        store.getters.get_username +
        "&token=" +
        store.getters.get_token +
        "&email=" +
        tEmail.value.email +
        "&code=" +
        tEmail.value.verify.code
    );
    rs.then((res) => {
      if (res.status) {
        message.success(res.message);
        tEmail.value.isEditDisable = true;
        tEmail.value.isBtnDisable = false;
        tEmail.value.isEditDisable1 = ref("display:none");
        tEmail.value.msg = "修改";
      } else {
        message.error(res.message);
        tEmail.value.isEditDisable = true;
        tEmail.value.isBtnDisable = false;
        tEmail.value.isEditDisable1 = ref("display:none");
        tEmail.value.msg = "修改";
      }
    });
  }
}

function sendChangeEmailCode() {
  tEmail.value.verify.isClick = true;
  tEmail.value.verify.msg = ref(`正在处理`);
  ldb.start();
  const rs = get(
      "https://api.locyanfrp.cn/Account/SendEditMail?username=" +
      store.getters.get_username +
      "&token=" +
      store.getters.get_token +
      "&email=" +
      tEmail.value.email
  );
  rs.then((res) => {
    if (res.status) {
      message.success(res.message);
      tEmail.value.verify.msg = ref(`已发送`);
    } else {
      message.error(res.message);
      tEmail.value.verify.isClick = false;
      tEmail.value.verify.msg = ref(`发送验证码`);
    }
    ldb.finish();
  });
}

function DoBindQQ() {
  binding.value = true;
  const rs = get(
      "https://api.locyanfrp.cn/OAuth/BindQQAccount?username=" +
      store.getters.get_username +
      "&token=" +
      store.getters.get_token,
      []
  );
  rs.then((res) => {
    if (res.status) {
      window.open(res.url);
      binding.value = false;
    }
  });
}

function UnBindQQ() {
  binding.value = true;
  const rs = get(
      "https://api.locyanfrp.cn/OAuth/QQUnBind?username=" +
      store.getters.get_username +
      "&token=" +
      store.getters.get_token,
      []
  );
  rs.then((res) => {
    if (res.status) {
      binding.value = false;
      bindQQ.value.unBindDisable = true;
      bindQQ.value.unBindmsg = ref("解绑成功");
      bindQQ.value.isDisable = false;
      bindQQ.value.msg = ref("点击绑定");
      setTimeout(() => {
        bindQQ.value.unBindmsg = ref("尚未绑定");
      }, 1000);
    } else {
      binding.value = false;
      bindQQ.value.unBindDisable = false;
      bindQQ.value.unBindmsg = ref("解绑失败");
      message.error("解绑失败，服务器错误");
      setTimeout(() => {
        bindQQ.value.unBindmsg = ref("解除绑定");
      }, 1000);
    }
  });
}

function DoLogOut() {
  sendSuccessMessage("您已登出，感谢您的使用！");
  logout();
}
</script>

<script>
import { ref } from "vue";

const show = ref(false);

export const ChangeUserInfoShow = (status1) => {
  show.value = status1;
};
</script>
