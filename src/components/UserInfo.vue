<template>
  <n-drawer v-model:show="show" :width="Width_DiaLog">
    <n-drawer-content title="个人信息" closable>
      <n-avatar round :size="80" :src="store.getters.get_avatar" />
      <br />
      <n-text style="font-size: 20px">{{ store.getters.get_username }} </n-text>
      <br />
      <n-text style="color: gray">本站使用 Cravatar 公用头像库 API ，可以前往
        <a target="_blank" href="https://cravatar.cn/">Cravatar</a> 或
        <a target="_blank" href="https://gravatar.com/">Gravatar</a>
        修改您的头像
      </n-text>
      <br />
      <n-h2>社交账号绑定</n-h2>
      <n-space>
        <n-h5 style="margin: 3px"> QQ:</n-h5>
        <n-button type="info" v-bind:disabled="bindQQ.isDisable" @click="DoBindQQ" :loading="binding">
          {{ bindQQ.msg }}
        </n-button>
        <n-button type="error" v-bind:disabled="bindQQ.unBindDisable" @click="UnBindQQ" :loading="binding">
          {{ bindQQ.unBindmsg }}
        </n-button>
      </n-space>
      <n-h2>修改信息</n-h2>
      <n-text style="color: gray">一旦修改信息，您的登录账户也会随之改变！ </n-text>
      <n-space vertical>
        <!-- 邮箱 -->
        <n-space>
          <n-h5 style="margin: 3px"> 邮箱：</n-h5>
          <n-input v-bind:disabled="tEmail.isEditDisable" v-model:value="tEmail.email" />
          <n-button @click="changeEmail" v-bind:disabled="tEmail.isBtnDisable" type="info">{{ tEmail.msg }}
          </n-button>
          <n-space v-bind:style="tEmail.isEditDisable1">
            <n-input v-model:value="tEmail.verify.code" style="max-width: 200px" placeholder="请输入验证码" />
            <n-button round ghost type="primary" v-bind:disabled="tEmail.verify.isClick" @click="sendChangeEmailCode">{{
    tEmail.verify.msg }}
            </n-button>
          </n-space>
        </n-space>
        <!-- 密码 -->
        <n-space vertical>
          <n-h5 style="margin: 3px"> 密码：</n-h5>
          <n-input v-model:value="tPassword.oldPaxsword" placeholder="原密码" type="password" />
          <n-input v-model:value="tPassword.newPassword" placeholder="新密码" type="password" />
          <n-input v-model:value="tPassword.confirmPassword" placeholder="重复密码" type="password" />
          <n-button @click="changePassword" :loading="tPassword.isLoading" type="info">{{ tPassword.msg }}
          </n-button>
        </n-space>
        <n-space>
          <n-h5 style="margin: 3px"> 其他操作：</n-h5>
          <n-button type="error" :loading="resetFrpTokenLoading" @click="resetFrpToken">
            重置 FrpToken
          </n-button>
          <n-button type="error" :loading="exitAllDevicesLoading" @click="exitAllDevices">
            吊销全部登录设备
          </n-button>
        </n-space>
      </n-space>
      <template #footer>
        <n-button ghost type="primary" @click="DoLogOut"> 退出登录 </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { logout } from '../utils/profile.js'
import store from '../utils/stores/store.js'
import { sendSuccessMessage } from '../utils/message.js'
import { ref } from 'vue'
import { get, post, Delete } from '../utils/request.js'
import { useDialog } from 'naive-ui'

const username = store.getters.get_username
const Width_DiaLog = ref('30vw')
const ldb = useLoadingBar()
const message = useMessage()
const binding = ref(false)
const resetFrpTokenLoading = ref(false);
const exitAllDevicesLoading = ref(false);
const dialog = useDialog();
if (document.body.clientWidth <= 800) {
  Width_DiaLog.value = '75vw'
}

const bindQQ = ref({
  isDisable: true,
  msg: '正在获取',
  unBindDisable: true,
  unBindmsg: '正在获取'
})

const tEmail = ref({
  email: store.getters.get_email,
  msg: '修改',
  isEditDisable1: 'display:none',
  isEditDisable: true,
  isBtnDisable: false,
  verify: {
    isClick: false,
    msg: '获取验证码',
    code: ''
  }
})

const tPassword = ref({
  msg: '重置',
  oldPaxsword: "",
  newPassword: "",
  confirmPassword: "",
  isLoading: false,
})

function queryBind() {
  const rs = get(
    'https://api-v2.locyanfrp.cn/api/v2/oauth/qq/check?username=' + store.getters.get_username
  )
  rs.then((res) => {
    if (!res.status === 200) {
      bindQQ.value.isDisable = false
      bindQQ.value.msg = ref('点击绑定')
      bindQQ.value.unBindDisable = true
      bindQQ.value.unBindmsg = ref('尚未绑定')
    } else {
      bindQQ.value.isDisable = true
      bindQQ.value.msg = ref('已绑定')
      bindQQ.value.unBindDisable = false
      bindQQ.value.unBindmsg = ref('解除绑定')
    }
  })
}

queryBind()

function changeEmail() {
  if (tEmail.value.isEditDisable) {
    tEmail.value.isEditDisable = false
    tEmail.value.isEditDisable1 = ref('')
    tEmail.value.msg = '确认'
  } else if (!tEmail.value.isEditDisable) {
    //换绑
    tEmail.value.isBtnDisable = true
    const rs = get(
      'https://api.locyanfrp.cn/Account/EditEmail?username=' +
      store.getters.get_username +
      '&token=' +
      store.getters.get_token +
      '&email=' +
      tEmail.value.email +
      '&code=' +
      tEmail.value.verify.code
    )
    rs.then((res) => {
      if (res.status) {
        message.success(res.message)
        tEmail.value.isEditDisable = true
        tEmail.value.isBtnDisable = false
        tEmail.value.isEditDisable1 = ref('display:none')
        tEmail.value.msg = '修改'
      } else {
        message.error(res.message)
        tEmail.value.isEditDisable = true
        tEmail.value.isBtnDisable = false
        tEmail.value.isEditDisable1 = ref('display:none')
        tEmail.value.msg = '修改'
      }
    })
  }
}

function sendChangeEmailCode() {
  tEmail.value.verify.isClick = true
  tEmail.value.verify.msg = ref(`正在处理`)
  ldb.start()
  const rs = get(
    'https://api.locyanfrp.cn/Account/SendEditMail?username=' +
    store.getters.get_username +
    '&token=' +
    store.getters.get_token +
    '&email=' +
    tEmail.value.email
  )
  rs.then((res) => {
    if (res.status) {
      message.success(res.message)
      tEmail.value.verify.msg = ref(`已发送`)
    } else {
      message.error(res.message)
      tEmail.value.verify.isClick = false
      tEmail.value.verify.msg = ref(`发送验证码`)
    }
    ldb.finish()
  })
}

function DoBindQQ() {
  binding.value = true
  const rs = get(
    'https://api-v2.locyanfrp.cn/api/v2/oauth/qq/bind?username=' + store.getters.get_username,
    []
  )
  rs.then((res) => {
    if (res.status == 200) {
      window.open(res.data.url)
      binding.value = false
    }
  })
}

function UnBindQQ() {
  binding.value = true
  const rs = get(
    'https://api-v2.locyanfrp.cn/api/v2/oauth/qq/unbind?username=' + store.getters.get_username,
    []
  )
  rs.then((res) => {
    if (res.status == 200) {
      binding.value = false
      bindQQ.value.unBindDisable = true
      bindQQ.value.unBindmsg = ref('解绑成功')
      bindQQ.value.isDisable = false
      bindQQ.value.msg = ref('点击绑定')
      setTimeout(() => {
        bindQQ.value.unBindmsg = ref('尚未绑定')
      }, 1000)
    } else {
      binding.value = false
      bindQQ.value.unBindDisable = false
      bindQQ.value.unBindmsg = ref('解绑失败')
      message.error('解绑失败，服务器错误')
      setTimeout(() => {
        bindQQ.value.unBindmsg = ref('解除绑定')
      }, 1000)
    }
  })
}

function DoLogOut() {
  sendSuccessMessage('您已登出，感谢您的使用！')
  logout()
}

async function changePassword() {
  tPassword.value.isLoading = true;
  if (tPassword.value.confirmPassword !== tPassword.value.newPassword) {
    tPassword.value.isLoading = false;
    message.error("两次输入的密码不一致");
    return;
  }
  const data = {
    "username": store.getters.get_username,
    "old_password": tPassword.value.oldPaxsword,
    "new_password": tPassword.value.newPassword,
  };

  const rs = await post("https://api-v2.locyanfrp.cn/api/v2/users/reset/password", data);
  if (rs.status === 200) {
    tPassword.value.isLoading = false;
    sendSuccessMessage("修改成功");
    DoLogOut();
  } else {
    tPassword.value.isLoading = false;
    message.error("密码修改失败, 后端返回: " + rs.data.msg);
  }
}

async function resetFrpToken() {
  resetFrpTokenLoading.value = true;

  const data = {
    "username": store.getters.get_username
  };

  dialog.warning({
    title: '警告',
    content: '你确定要重置 FrpToken 吗? 重置后, 所有 Frp 隧道需更新原本信息, 否则将无法启动',
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: async () => {
      const rs = await get("https://api-v2.locyanfrp.cn/api/v2/users/reset/frp_token", data);
      if (rs.status === 200) {
        resetFrpTokenLoading.value = false;
        store.commit("setFrpToken",)
        sendSuccessMessage("重置成功");
      } else {
        resetFrpTokenLoading.value = false;
        message.error("重置失败, 后端返回: " + rs.data.msg);
      }
    },
    onNegativeClick: () => {
      resetFrpTokenLoading.value = false;
    }
  })
}

async function exitAllDevices() {
  exitAllDevicesLoading.value = true;

  const data = {
    "username": store.getters.get_username
  };

  dialog.warning({
    title: '警告',
    content: '你确定要登出全部设备吗, 所有登录将会失效',
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: async () => {
      const rs = await Delete("https://api-v2.locyanfrp.cn/api/v2/users/reset/token/all", data);
      if (rs.status === 200) {
        exitAllDevicesLoading.value = false;
        sendSuccessMessage("已全部退出");
        DoLogOut();
      } else {
        exitAllDevicesLoading.value = false;
        message.error("退出失败, 后端返回: " + rs.data.msg);
      }
    },
    onNegativeClick: () => {
      exitAllDevicesLoading.value = false;
    }
  })
}
</script>

<script>
import { ref } from 'vue'

const show = ref(false)

export const ChangeUserInfoShow = (status1) => {
  show.value = status1
}
</script>
