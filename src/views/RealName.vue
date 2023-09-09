<template>
  <template v-if="loading">
    <n-h1 prefix="bar" style="margin-top: 30px">
      <i class="twa twa-card-file-box"></i>
      <n-text type="primary"> 实名认证</n-text>
    </n-h1>
    <n-grid cols="1" item-responsive>
      <n-grid-item span="1">
        <n-card>
          <n-skeleton text :repeat="3"/>
        </n-card>
      </n-grid-item>
    </n-grid>
  </template>
  <template v-else>
    <n-h1 prefix="bar" style="margin-top: 30px">
      <i class="twa twa-card-file-box"></i>
      <n-text type="primary"> 实名认证</n-text>
    </n-h1>
    <n-grid cols="1" item-responsive>
      <n-grid-item span="1">
        <n-form
            :ref="formRef"
            :model="UserProfile"
            label-width="auto"
            :size="'large'"
            v-show="showRealnameModal"
        >
          <n-grid cols="1" item-responsive :y-gap="5">
            <n-grid-item>
              <p style="color: red">
                请填写您的姓名和身份证号进行实名认证（请认真填写，实名一旦成功除特殊情况外无法修改）
              </p>
              <p>
                若点击提交后 5 秒内没有回调信息出现，请再次点击按钮，直到出现提示框。若无法实名，请联系管理员解决！
              </p>
              <p>
                本站全部个人隐私信息遵守 <a
                  style="color: dodgerblue"
                  href="https://www.locyan.cn/doc/yszc.html"
                  target="_blank"
              >LoCyan 隐私协议</a
              > 的约束，我们将最大限度的保护用户的个人信息数据
              </p>
              <p>
                我们允许<a style="color: red"><b>未成年人注册</b></a
              >，请勿冒用非本人身份证实名，已经实名过得既往不咎！
              </p>
            </n-grid-item>
            <n-grid-item span="1">
              <n-form-item label="姓名" path="name">
                <n-input
                    v-model:value="UserProfile.name"
                    placeholder="您的姓名"
                />
              </n-form-item>
            </n-grid-item>
            <n-grid-item span="1">
              <n-form-item label="身份证号" path="idcard">
                <n-input
                    v-model:value="UserProfile.idcard"
                    placeholder="您的身份证号"
                />
              </n-form-item>
            </n-grid-item>
          </n-grid>
          <div style="display: flex; justify-content: flex-end">
            <n-button round type="primary" @click="submitrealname()">
              提交
            </n-button>
          </div>
        </n-form>
      </n-grid-item>
    </n-grid>
    <n-grid cols="1" item-responsive>
      <n-grid-item span="1">
        <n-card v-show="!showRealnameModal">
          <i class="twa twa-2x twa-party-popper"></i>您已经完成实名认证！
        </n-card>
      </n-grid-item>
    </n-grid>
  </template>
</template>

<script setup>
import {ref} from "vue";
import {SendSuccessDialog, SendWarningDialog} from "../utils/dialog";
import {FinishLoadingBar, StartLoadingBar} from "../utils/loadingbar";
import {get, post} from "../utils/request.js";
import store from "../utils/stores/store.js";

const loading = ref(true);
const showRealnameModal = ref(true);
const formRef = ref(null);
const UserProfile = ref({
  name: "",
  idcard: "",
});

function submitrealname() {
  StartLoadingBar();
  const SubmitForm = {
    username: store.getters.get_username,
    name: UserProfile.value.name,
    idcard: UserProfile.value.idcard,
    key: "LocyanRealname",
  };
  const rs = post("https://api.locyanfrp.cn/Account/realname", SubmitForm);
  rs.then((res) => {
    if (res.status) {
      CheckRealNameStatus();
      FinishLoadingBar();
      SendSuccessDialog(res.message);
    } else {
      FinishLoadingBar();
      SendWarningDialog(res.message);
    }
  });
}

function CheckRealNameStatus() {
  const rs = get(
      "https://api.locyanfrp.cn/Account/GetRealnameStatus?username=" +
      store.getters.get_username
  );
  rs.then((res) => {
    if (res.status) {
      showRealnameModal.value = false;
      loading.value = false;
    } else {
      showRealnameModal.value = true;
      loading.value = false;
    }
  });
}

CheckRealNameStatus();
</script>
