<template>
    <n-grid cols="3" item-responsive>
        <n-grid-item v-for="item in PrizesList" id="item" span="0:3 950:1">
            <n-space style="display: block;">
                <n-card :title="'奖品： ' + item.prizename">
                    <p>开奖时间：{{ timestampToTime(item.prizetime) }}</p>
                    <p>获奖人：{{ item.prize_user || "暂未开奖！" }}</p>
                    <p>参与用户：{{ item.username || "无用户参与！" }}</p>
                    <p>奖品描述：</p>
                    {{ item.description }}
                    <template #footer>
                        <n-space justify="space-between">
                            创建时间：{{ timestampToTime(item.createtime) }}
                            <n-button @click="submitjoin(item.id)" v-show="item.id"> 参与 </n-button>
                        </n-space>
                    </template>
                </n-card>
            </n-space>
        </n-grid-item>
    </n-grid>
</template>

<script setup>
import { NGrid, NGridItem, NCard, NInput, NForm, NFormItem, NButton, NSpace, NAvatar } from 'naive-ui';
import { ref } from 'vue';
import { SendErrorDialog, SendSuccessDialog, SendWarningDialog } from '../utils/dialog';
import { FinishLoadingBar, StartLoadingBar } from '../utils/loadingbar';
import { post, get } from "../utils/request.js";
import store from "../utils/store.js"

const PrizesList = ref([]);
const formRef = ref(null);

// 时间戳转换
function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear() + "-";
    var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
    var h = date.getHours() + ":";
    var m = date.getMinutes() + ":";
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
};

function submitjoin(id) {
    StartLoadingBar();
    const rs = get("https://api.locyanfrp.cn/Prize/JoinPrize?username=" + store.getters.GetUserName + "&id=" + id);
    rs.then(res => {
        if (res.status) {
            FinishLoadingBar();
            SendSuccessDialog(res.message);
            const rs = get("https://api.locyanfrp.cn/Prize/GetPrizes");
            rs.then(res => {
                PrizesList.value = res;
            });
        } else {
            FinishLoadingBar();
            SendWarningDialog(res.message);
        }
    })
};

const rs = get("https://api.locyanfrp.cn/Prize/GetPrizes");
rs.then(res => {
    PrizesList.value = res;
});

</script>
<style scoped>

#item {
    max-width: 100vw;
    margin: 20px;
}

@media (max-width: 1300px) {
    #item {
        margin: 10px;
    }
}
</style>