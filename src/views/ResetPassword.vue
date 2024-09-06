<template>
  <n-grid cols="1" item-responsive>
    <n-grid-item span="1">
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="medium"
        id="item"
        v-show="send_resset_mail"
      >
        <n-form-item label="用户名 / 邮箱" path="username">
          <n-input
            type="text"
            v-model:value="model.username"
            placeholder="用户名"
            @keyup.enter="sendResetMail"
          />
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-space>
            <n-button type="primary" @click="sendResetMail" style="margin-right: 10px">
              发送邮件
            </n-button>
            <n-button ghost type="primary" @click="goLogin"> 登录</n-button>
          </n-space>
        </div>
      </n-form>
      <n-form
        ref="formRef"
        :model="reset_password"
        :rules="rules"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="medium"
        id="item"
        v-show="!send_resset_mail"
      >
        <n-form-item label="新密码" path="password">
          <n-input type="text" v-model:value="reset_password.password" placeholder="新密码" />
        </n-form-item>
        <n-form-item label="重复密码" path="confirm">
          <n-input type="text" v-model:value="reset_password.confirm" placeholder="重复密码" />
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-space>
            <n-button type="primary" @click="doResetRequest" style="margin-right: 10px">
              提交
            </n-button>
          </n-space>
        </div>
      </n-form>
    </n-grid-item>
  </n-grid>
</template>

<script setup>
import { ref } from 'vue'
import { useLoadingBar, useMessage } from 'naive-ui'
import { getUrlKey } from '@/utils/request'
import router from '@/router/index'
import api from '@/api'
import logger from '@/utils/logger'

const formRef = ref(null)
const message = useMessage()
const ldb = useLoadingBar()
const status = ref('initing')
const send_resset_mail = ref(true)

const model = ref([
  {
    username: ''
  }
])

const reset_password = ref([
  {
    password: '',
    confirm: ''
  }
])

// 检查是否存在redirect值
const code = getUrlKey('code')
if (code !== null) {
  logger.info('重置密码标识符: ' + code)
  send_resset_mail.value = false
}

function goLogin() {
  router.push('/login')
}

async function doResetRequest() {
  if (code === '' || code === undefined) {
    message.error('非法请求！')
    return
  }

  if (status.value === 'reseting') {
    message.warning('上一个请求正在处理！')
    return
  }
  status.value = 'reseting'
  ldb.start()
  let rs
  try {
    rs = await api.v1.User.DoResetPassword(
      reset_password.value.password,
      reset_password.value.confirm,
      code
    )
  } catch (e) {
    message.error('请求重置密码失败: ' + e)
  }
  if (!rs) {
    ldb.error()
    return
  }
  if (rs.status === 200) {
    if (rs.data.status) {
      message.success(rs.message)
    } else {
      message.error(rs.message)
    }
  } else {
    message.error(rs.message)
  }
  ldb.finish()
  status.value = 'complete'
}

async function sendResetMail() {
  if (status.value === 'sending') {
    message.warning('上一个请求正在处理！')
    return
  }
  status.value = 'sending'
  ldb.start()
  let rs
  try {
    rs = await api.v1.User.DoResetPasswordEmailSend(model.value.username)
  } catch (e) {
    message.error('请求' + e)
  }
  if (!rs) {
    ldb.error()
    return
  }
  if (rs.status === 200) {
    if (rs.data.status) {
      message.success(rs.message)
    } else {
      message.error(rs.message)
    }
  } else {
    message.error(rs.message)
  }
  ldb.finish()
  status.value = 'complete'
}

const rules = {
  username: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入用户名'
  }
}
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
