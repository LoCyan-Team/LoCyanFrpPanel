<template>
  <n-drawer v-model:show = "show" :width=Width_DiaLog>
    <n-drawer-content title="个人信息" closable>
      <n-avatar
          round
          :size="128"
          :src="store.getters.GetAvatar"
      />
      <br />
      <n-text>{{ store.getters.GetUserName }}</n-text>
      <br />
      <n-h2>社交账号绑定</n-h2>
      <n-space>
        <n-h5 style="margin: 3px"> QQ: </n-h5>
        <n-button type="info" @click="DoBindQQ" :loading="binding"> 绑定QQ账号 </n-button>
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
import { NDrawer, NDrawerContent, NAvatar, NText, NButton, NH2, NH5, NSpace} from "naive-ui";
import {SendSuccessMessage} from "../utils/message.js";
import { ref } from "vue";
import { get } from "../utils/request.js";

const username = store.getters.GetUserName
const Width_DiaLog = ref("30vw");
const binding = ref(false);
if (document.body.clientWidth <= 800) {
  Width_DiaLog.value = "75vw";
}

function DoBindQQ(){
  binding.value = true;
  const rs = get("https://api.locyanfrp.cn/OAuth/BindQQAccount?username=" + store.getters.GetUserName + "&token=" + store.getters.GetToken, []);
  rs.then(res => {
    if (res.status){
      window.open(res.url);
      binding.value = false;
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