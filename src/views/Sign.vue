<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-spiral-calendar"></i>
    <n-text type="primary"> 签到</n-text>
  </n-h1>
  <n-space vertical>
    <n-grid cols="1" item-responsive>
      <n-grid-item span="1">
        <n-card title="签到" size="medium">
          <n-space justify="space-between">
            <p>通过签到你可以获得更多流量</p>
            <n-button v-if="status === '已签到'" round @click="DoSign" dashed>
              已签到
            </n-button>
            <n-button
                v-if="status === '尚未签到'"
                strong
                secondary
                type="success"
                @click="DoSign"
            >
              签到
            </n-button>
          </n-space>
          <p v-if="status">状态：{{ status }}</p>
          <n-skeleton text :repeat="1" style="width: 10%" v-else/>
          <br/>
          <n-gi v-if="status === '已签到'">
            <img style="width: 100%" src="https://api.imlazy.ink/img"/>
          </n-gi>
        </n-card>
      </n-grid-item>
    </n-grid>
  </n-space>
</template>
<style scoped>
:deep(.creative-enter-from),:deep(.creative-leave-to){opacity:0;transform:scale(0.8);}:deep(.creative-enter-active),:deep(.creative-leave-active){transition:all 0.3s ease;}.carousel-img{width:100%;height:800px;object-fit:cover;}.custom-arrow{display:flex;position:absolute;bottom:25px;right:10px;}.custom-arrow button{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;margin-right:12px;color:#fff;background-color:rgba(255,255,255,0.1);border-width:0;border-radius:8px;transition:background-color 0.3s cubic-bezier(0.4,0,0.2,1);cursor:pointer;}.custom-arrow button:hover{background-color:rgba(255,255,255,0.2);}.custom-arrow button:active{transform:scale(0.95);transform-origin:center;}.custom-dots{display:flex;margin:0;padding:0;position:absolute;bottom:20px;left:20px;}.custom-dots li{display:inline-block;width:12px;height:4px;margin:0 3px;border-radius:4px;background-color:rgba(255,255,255,0.4);transition:width 0.3s,background-color 0.3s cubic-bezier(0.4,0,0.2,1);cursor:pointer;}.custom-dots li.is-active{width:40px;background:#fff;
}
</style>
<script setup>
import {ref} from "vue";
import {NButton, NCard, NGrid, NGridItem, NH1, NSkeleton, NSpace, NText,} from "naive-ui";
import {post} from "../utils/request.js";
import {sendErrorMessage} from "../utils/message";
import {SendSuccessDialog} from "../utils/dialog.js";
import store from "../utils/stores/store.js";

const status = ref("");

function CheckSign() {
  const rs = post(
      "https://api.locyanfrp.cn/User/CheckSign",
      {token: store.getters.get_token},
      {}
  );
  rs.then((res) => {
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
  const rs = post("https://api.locyanfrp.cn/User/DoSign", {
    token: store.getters.get_token,
  });
  rs.then((res) => {
    if (!res.status) {
      sendErrorMessage(res.message);
      CheckSign();
    } else {
      SendSuccessDialog(res.message);
      CheckSign();
    }
  });
}
</script>
