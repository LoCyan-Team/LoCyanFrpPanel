<template>
  <n-drawer v-model:show = "show" :width="502">
    <n-drawer-content title="个人信息" closable>
      <n-avatar
          round
          :size="128"
          :src="store.getters.GetAvatar"
      />
      <br />
      <n-text>{{ store.getters.GetUserName }}</n-text>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>

import store from "../utils/store";
import { NDrawer, NDrawerContent, NAvatar, NText} from "naive-ui";

const username = store.getters.GetUserName

</script>

<script>

import { ref } from "vue";
const show = ref(false);

export const ChangeUserInfoShow = (status1) => {
  show.value = status1;
}

</script>