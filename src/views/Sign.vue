<template>
    <n-h1 prefix="bar" style="margin-left: 15px;margin-top: 30px;">
        <n-text type="primary">
            每日签到
        </n-text>
    </n-h1>
    <n-space vertical>
        <n-card title="每日签到" size="large">
            <n-space justify="space-between">
                <p>通过签到你可以获得更多流量</p>
                <n-button v-if="status=='已签到'" round  @click="DoSign" dashed>
                    已签到！
                </n-button>
                <n-button v-if="status=='未签到'" strong secondary type="success" @click="DoSign">
                    签到！
                </n-button>
            </n-space>
            <p v-if="status">签到状态：{{ status }}</p>
            <n-skeleton text :repeat="1" style="width: 10%" v-else/>
        </n-card>
    </n-space>
</template>

<script setup>
import { ref } from "vue";
import { NSkeleton ,NSpace, NCard, NButton, NH1, NText } from "naive-ui"
import { post } from "../utils/request.js";
import { SendSuccessMessage, SendErrorMessage } from "../utils/message";
import { SendSuccessDialog } from "../utils/dialog.js"
import store from "../utils/store.js";

const status = ref("");

function CheckSign() {
    const rs = post("https://api.locyanfrp.cn/User/CheckSign", { token: store.getters.GetToken })
    rs.then(res => {
        if (!res.status) {
            status.value = res.message;
        } else {
            status.value = res.message;
        };
    });
};

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
        };
    });
};

</script>

<style scoped>
.n-card {
    max-width: 100%;
    margin-left: 30px;
    padding-right: 30px;
    margin-top: 30px;
}
</style>