<template>
  <n-grid cols="1" item-responsive>
    <n-grid-item span="1">
      <n-form ref="formRef" :model="model" :rules="rules" label-width="auto" require-mark-placement="right-hanging"
        size="medium" id="item">
        <n-form-item label="用户名 / 邮箱" path="username">
          <n-input type="text" v-model:value="model.username" placeholder="用户名" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input type="password" v-model:value="model.password" placeholder="密码" />
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-space>
            <n-button type="primary" @click="login" style="margin-right: 10px;"> 登录 </n-button>
            <n-button ghost type="primary" @click="goregister"> 没注册？</n-button>
          </n-space>
        </div>
      </n-form>
    </n-grid-item>
  </n-grid>
</template>

<script setup>
import { ref } from "vue";
import { NFormItem, NForm, NInput, NButton, useMessage, useLoadingBar, NGrid, NGridItem, NSpace } from "naive-ui";
import { get, post, getUrlKey } from "../utils/request.js";
import router from "../router/index.js";
import qs from 'qs';
import store from "../utils/store.js";

const formRef = ref(null);
const message = useMessage();
const ldb = useLoadingBar();

const model = ref([
  {
    username: "",
    password: ""
  }
]);

// 检查是否存在redirect值
const redirect = getUrlKey("redirect");
if (redirect !== null){
  console.log("登录后返回" + redirect);
}

function goregister() {
  router.push("/register");
}

function login(e) {
  ldb.start();
  const rs = get("https://api.locyanfrp.cn/User/DoLogin?" + qs.stringify(model.value), []);
  rs.then(res => {
    if (res.status === 0) {
      message.success("欢迎回来，指挥官！" + model.value.username);
      store.commit("setToken", res.token);
      store.commit("setUserInfo", res.userdata);
      router.push(redirect || "/user");
    } else {
      message.warning(res.message);
    }
    ldb.finish();
  });
}

const rules = {
  username: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入用户名",
  },
  password: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入密码",
  },
};
</script>

<style scoped>
#item {
  margin-top: calc(50vh - 160px);
  margin-left: 240px;
  margin-right: 240px;
}

@media (max-width: 1300px) {
  #item {
    margin-top: calc(50vh - 160px);
    margin-left: 20px;
    margin-right: 20px;
  }
}
</style>