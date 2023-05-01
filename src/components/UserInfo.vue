<template>
  <n-drawer v-model:show="show" :width=Width_DiaLog>
    <n-drawer-content title="个人信息" closable>
      <n-avatar round :size="80" :src="store.getters.GetAvatar" />
      <br />
      <n-text style="font-size: 20px">{{ store.getters.GetUserName }}</n-text><br>
      <n-text style="color: gray">本站使用Cravatar公用头像库API，可以前往 Cravatar 或 Gravatar修改您的头像</n-text>
      <br />
      <n-h2>社交账号绑定</n-h2>
      <n-space>
        <n-h5 style="margin: 3px"> QQ: </n-h5>
        <n-button type="info" v-bind:disabled="bindQQ.isDisable" @click="DoBindQQ" :loading="binding"> {{ bindQQ.msg }} </n-button>
        <n-button type="error" v-bind:disabled="bindQQ.unBindDisable" @click="UnBindQQ" :loading="binding"> {{ bindQQ.unBindmsg }} </n-button>
      </n-space>
      <template #footer>
        <n-button ghost round type="primary" @click="DoLogOut"> 退出登录 </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>

import { Logout } from "../utils/profile.js";
import store from "../utils/stores/store.js";
import { NDrawer, NDrawerContent, NAvatar, NText, NButton, NH2, NH5, NSpace } from "naive-ui";
import { SendSuccessMessage } from "../utils/message.js";
import { ref } from "vue";
import { get } from "../utils/request.js";

const username = store.getters.GetUserName
const Width_DiaLog = ref("30vw");
const binding = ref(false);
if (document.body.clientWidth <= 800) {
  Width_DiaLog.value = "75vw";
}

const bindQQ = ref({
  isDisable: true,
  msg: "正在获取",
  unBindDisable: true,
  unBindmsg: "正在获取"
})

function queryBind() {
  const rs = get("https://api.locyanfrp.cn/OAuth/CheckQQIsBind?username=" + store.getters.GetUserName)
  rs.then(res => {
    if (!res.status) {
      bindQQ.value.isDisable = false
      bindQQ.value.msg = ref("点击绑定")
      bindQQ.value.unBindDisable = true
      bindQQ.value.unBindmsg = ref("尚未绑定")
    } else {
      bindQQ.value.isDisable = true
      bindQQ.value.msg = ref("已绑定！")
      bindQQ.value.unBindDisable = false
      bindQQ.value.unBindmsg = ref("解除绑定")
    }
  })
}
console.log("初始化绑定")
queryBind()

function DoBindQQ() {
  binding.value = true;
  const rs = get("https://api.locyanfrp.cn/OAuth/BindQQAccount?username=" + store.getters.GetUserName + "&token=" + store.getters.GetToken, []);
  rs.then(res => {
    if (res.status) {
      window.open(res.url);
      binding.value = false;
    }
  })
}
function UnBindQQ() {
  binding.value = true;
  const rs = get("https://api.locyanfrp.cn/OAuth/QQUnBind?username=" + store.getters.GetUserName + "&token=" + store.getters.GetToken, []);
  rs.then(res => {
    if (res.status) {
      binding.value = false;
      bindQQ.value.unBindDisable = true
      bindQQ.value.unBindmsg = ref("解绑成功")
      bindQQ.value.isDisable = false
      bindQQ.value.msg = ref("点击绑定")
      setTimeout(() => { bindQQ.value.unBindmsg = ref("尚未绑定") }, 1000)
    } else {
      binding.value = false;
      bindQQ.value.unBindDisable = false
      bindQQ.value.unBindmsg = ref("解绑失败")
      message.error("解绑失败，服务器错误")
      setTimeout(() => { bindQQ.value.unBindmsg = ref("解除绑定") }, 1000)
    }
  })
}

function DoLogOut() {
  SendSuccessMessage("您已从LCF登出，感谢您的使用！")
  Logout();
}
</script>

<script>

import { ref } from "vue";
const show = ref(false);

export const ChangeUserInfoShow = (status1) => {
  show.value = status1;
}

</script>