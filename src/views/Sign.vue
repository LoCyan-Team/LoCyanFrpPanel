<template>
    <n-h1 prefix="bar" style="margin-top: 30px;">
        <n-text type="primary">
            每日签到
        </n-text>
    </n-h1>
    <n-space vertical>
      <n-grid cols="1" item-responsive>
        <n-grid-item span="1">
          <n-card title="每日签到" size="medium">
              <n-space justify="space-between">
                  <p>通过签到你可以获得更多流量</p>
                  <n-button v-if="status==='已签到'" round  @click="DoSign" dashed>
                      已签到！
                  </n-button>
                  <n-button v-if="status==='尚未签到'" strong secondary type="success" @click="DoSign">
                      签到！
                  </n-button>
              </n-space>
              <p v-if="status">签到状态：{{ status }}</p>
              <n-skeleton text :repeat="1" style="width: 10%" v-else/>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-space>
</template>

<script setup>
import { ref } from "vue";
import { NSkeleton ,NSpace, NCard, NButton, NH1, NText, NGrid, NGridItem } from "naive-ui"
import { post } from "../utils/request.js";
import { SendErrorMessage } from "../utils/message";
import { SendSuccessDialog } from "../utils/dialog.js"
import store from "../utils/stores/store.js";

const status = ref("");

function CheckSign() {
    const rs = post("https://api.locyanfrp.cn/User/CheckSign", { token: store.getters.GetToken }, {})
    rs.then(res => {
        if (!res.status) {
            status.value = res.message;
        } else {
            status.value = res.message;
        }
    });
}

// 检测签到状态
CheckSign();

function DoSign() {
    const rs = post("https://api.locyanfrp.cn/User/DoSign", { token: store.getters.GetToken })
    rs.then(res => {
        if (!res.status) {
            SendErrorMessage(res.message);
            CheckSign();
        } else {
            SendSuccessDialog(res.message);
            CheckSign();
        }
    });
}

</script>