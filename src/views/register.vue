<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-width="auto" require-mark-placement="right-hanging"
    size="medium" id="item">
    <n-form-item label="用户名" path="username">
      <n-input type="text" v-model:value="model.username" placeholder="用户名" />
    </n-form-item>
    <n-form-item label="邮箱" path="email">
      <n-input type="text" v-model:value="model.email" placeholder="邮箱" />
    </n-form-item>
    <n-form-item label="密码" path="password">
      <n-input type="password" v-model:value="model.password" placeholder="密码" />
    </n-form-item>
    <n-form-item label="确认密码" path="confirmpwd">
      <n-input type="password" v-model:value="model.confirmpwd" placeholder="再次输入密码" />
    </n-form-item>
    <n-form-item label="QQ" path="qq">
      <n-input type="text" v-model:value="model.qq" placeholder="QQ号" />
    </n-form-item>
    <n-form-item label="verify" path="verify">
      <n-input type="text" v-model:value="model.verify" placeholder="验证码" />
      <n-button ghost round type="primary" @click="sendcode"> 发送验证码 </n-button>
    </n-form-item>
    <div style="display: flex; justify-content: flex-end">
      <n-space>
        <n-button type="primary" @click="register" style="margin-right: 10px;"> 注册 </n-button>
        <n-button ghost type="primary" @click="gologin"> 去登录</n-button>
      </n-space>
    </div>
  </n-form>
</template>

<script setup>
import { ref } from "vue";
import { NFormItem, NForm, NInput, NButton, useMessage, useLoadingBar, NSpace } from "naive-ui";
import { post } from "../utils/request.js";
import router from "../router/index.js";

const formRef = ref(null);
const message = useMessage();
const ldb = useLoadingBar();

const model = ref([
  {
    username: "",
    password: "",
    email: "",
    confirmpwd: "",
    qq: "",
    verify: ""
  }
]);

function gologin() {
  router.push("/Login");
}

function sendcode() {
  ldb.start();
  const rs = post("https://api.locyanfrp.cn/User/SendRegCode", model.value);
  rs.then(res => {
    if (res.status) {
      message.success(res.message);
    } else {
      message.error(res.message);
    }
    ldb.finish();
  });
}

function register(e) {
  ldb.start();
  const rs = post("https://api.locyanfrp.cn/User/DoReg", model.value);
  rs.then(res => {
    if (res.status) {
      message.success(res.message);
      router.push("/login");
    } else {
      message.error(res.message);
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
  confirmpwd: {
    required: true,
    trigger: ["blur", "input"],
    message: "请再次输入密码",
  },
  qq: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入您的QQ号",
  },
  email: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error("请输入邮箱");
      } else if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)) {
        return new Error("邮箱格式错误");
      }
      return true;
    },
    trigger: ["blur", "input"],
  },
  verify: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入邮箱验证码",
  },
};
</script>

<style scoped>
#item {
  margin-top: calc(50vh - 320px);
  margin-left: 240px;
  margin-right: 240px;
}

@media (max-width: 1300px) {
  #item {
    margin-top: calc(50vh - 320px);
    margin-left: 20px;
    margin-right: 20px;
  }
}
</style>