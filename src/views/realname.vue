<template>
    <n-form :ref="formRef" :model="UserProfile" label-width="auto" :size="'large'" v-show="showRealnameModal">
        <n-grid cols="1" item-responsive>
            <n-grid-item span="1" id="item">
                <n-form-item label="姓名" path="name">
                    <n-input v-model:value="UserProfile.name" placeholder="您的姓名" />
                </n-form-item>
            </n-grid-item>
            <n-grid-item span="1" id="item">
                <n-form-item label="身份证号" path="idcard">
                    <n-input v-model:value="UserProfile.idcard" placeholder="您的身份证号" />
                </n-form-item>
            </n-grid-item>
        </n-grid>
        <div style="display: flex; justify-content: flex-end">
            <n-button round type="primary" @click="submitrealname();">
                提交
            </n-button>
        </div>
    </n-form>
    <n-card v-show="!showRealnameModal" id="item">
        您已经完成实名认证
    </n-card>
</template>

<script setup>
import { NGrid, NGridItem, NCard, NInput, NForm, NFormItem, NButton } from 'naive-ui';
import { ref } from 'vue';
import { SendSuccessDialog, SendWarningDialog } from '../utils/dialog';
import { FinishLoadingBar, StartLoadingBar } from '../utils/loadingbar';
import { post, get } from "../utils/request.js";
import store from "../utils/store.js"


const showRealnameModal = ref(true);
const formRef = ref(null);
const UserProfile = ref({
    name: "",
    idcard: ""
});

function submitrealname(){
    StartLoadingBar();
    const SubmitForm = {
        username: store.getters.GetUserName,
        name: UserProfile.value.name,
        idcard: UserProfile.value.idcard,
        key: ""
    };
    const rs = post("https://api.locyanfrp.cn/Account/realname", SubmitForm);
    rs.then(res => {
        if(res.status){
            CheckRealNameStatus();
            FinishLoadingBar();
            SendSuccessDialog(res.message);
        } else {
            FinishLoadingBar();
            SendWarningDialog(res.message);
        }
    })
}

function CheckRealNameStatus(){
    const rs = get("https://api.locyanfrp.cn/Account/GetRealnameStatus?username=" + store.getters.GetUserName);
    rs.then(res => {
        if(res.status){
            showRealnameModal.value = false;
        } else {
            showRealnameModal.value = true;
        }
    })
}

CheckRealNameStatus();

</script>
<style scoped>
.n-form {
    margin: 20px;
}

#item {
    max-width: 100vw;
    margin: 20px;
}

@media (max-width: 1300px) {
    .n-form {
        margin: 10px;
    }
}
</style>