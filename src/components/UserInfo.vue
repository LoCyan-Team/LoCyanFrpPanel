<template>
  <n-drawer v-model:show = "show" :width="'75vw'">
    <n-drawer-content title="个人信息" closable>
      <n-avatar
          round
          :size="128"
          :src="store.getters.GetAvatar"
      />
      <br />
      <n-text>{{ store.getters.GetUserName }}</n-text>
      <template #footer>
        <n-button ghost round type="primary" @click="DoLogOut">退出登录</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>

import { Logout } from "../utils/profile.js";
import store from "../utils/store";
import { NDrawer, NDrawerContent, NAvatar, NText, NButton} from "naive-ui";
import {SendSuccessMessage} from "../utils/message.js";

const username = store.getters.GetUserName

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