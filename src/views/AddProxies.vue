<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-writing-hand-light-skin-tone"></i>
    <n-text type="primary"> 添加隧道</n-text>
  </n-h1>
  <n-form :ref="formRef" :model="proxyInfo" :rules="rules" label-width="auto" size="large">
    <n-space vertical>
      <n-form-item label="选择服务器" path="node">
        <n-select v-model:value="proxyInfo.node" :options="serverList" size="medium" />
      </n-form-item>
    </n-space>
    <div id="item">
      <p>服务器信息：</p>
      <p>服务器名：{{ serverValue[proxyInfo.node].name }}</p>
      <p>服务器介绍：{{ serverValue[proxyInfo.node].description }}</p>
      <p>服务器IP：{{ serverValue[proxyInfo.node].ip }}</p>
      <p>服务器域名：{{ serverValue[proxyInfo.node].hostname }}</p>
    </div>
    <br />
    <n-grid x-gap="12" cols="2" item-responsive>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="隧道名" path="proxy_name">
          <n-input v-model:value="proxyInfo.proxy_name" placeholder="隧道名" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="穿透协议" path="proxy_type">
          <n-radio-group
            v-model:value="proxyInfo.proxy_type"
            @update:value="proxyTypeSelectChangeHandle"
          >
            <n-radio-button value="1"> TCP</n-radio-button>
            <n-radio-button value="2"> UDP</n-radio-button>
            <n-radio-button value="3"> HTTP</n-radio-button>
            <n-radio-button value="4"> HTTPS</n-radio-button>
            <n-radio-button value="5"> XTCP</n-radio-button>
            <n-radio-button value="6"> STCP</n-radio-button>
          </n-radio-group>
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="内网IP" path="local_ip">
          <n-input v-model:value="proxyInfo.local_ip" placeholder="内网IP, 例如127.0.0.1" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="内网端口" path="local_port">
          <n-input
            v-model:value="proxyInfo.local_port"
            placeholder="内网端口, HTTP:80 HTTPS:443 MC:25565/19132 泰拉瑞亚:7777"
          />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="远程端口" path="remote_port">
          <n-input
            v-model:value="proxyInfo.remote_port"
            placeholder="映射到远程服务器上的端口"
            style="margin-right: 10px"
          />
          <n-button @click="randomPort"> 随机端口 </n-button>
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="自定义域名" path="domain" v-show="showDomainInput">
          <n-input
            v-model:value="proxyInfo.domain"
            placeholder="HTTPS/HTTP需要填写, 其他协议不需要填写"
          />
        </n-form-item>
        <n-form-item label="访问密钥" path="sk" v-show="showSecretKeyInput">
          <n-input
            v-model:value="proxyInfo.sk"
            placeholder="XTCP / STCP 需要填写, 其他协议不需要填写"
          />
        </n-form-item>
      </n-grid-item>
    </n-grid>
    <div style="display: flex; justify-content: flex-end">
      <n-button round type="primary" @click="addProxy"> 创建</n-button>
    </div>
  </n-form>
</template>
<style>
n-input {
  width: 50%;
}
</style>
<script setup>
import { onMounted, ref } from 'vue'
import userData from '@/utils/stores/userData'
import { sendErrorMessage } from '@/utils/message'
import { sendErrorDialog, sendSuccessDialog } from '@/utils/dialog'
import api from '@/api'
import logger from '@/utils/logger'

localStorage.setItem('ViewPage', 'add_proxy')
// 选择框数据
const serverList = ref([])
// 服务器数据
const serverValue = ref([
  {
    id: 0,
    name: '',
    description: '',
    ip: '',
    hostname: '',
    status: 0
  }
])
// 表格数据
const formRef = ref(null)
// 表单数据集合
const proxyInfo = ref({
  node: 0,
  proxy_name: '',
  proxy_type: '1',
  local_ip: '127.0.0.1',
  local_port: null,
  remote_port: null,
  domain: '',
  sk: ''
})
const editCheck = ref(false)
const rules = {
  proxy_name: {
    required: true,
    trigger: ['blur', 'input'],
    validator(rule, value) {
      if (!value) {
        editCheck.value = false
        return new Error('请输入隧道名')
      } else if (!/[a-zA-Z0-9]{1,16}$/.test(value)) {
        editCheck.value = false
        return new Error('隧道名格式错误，由字母，数字和下划线组成')
      }
      editCheck.value = true
      return true
    }
  },
  proxy_type: {
    required: true
  },
  local_ip: {
    required: true,
    trigger: ['blur', 'input'],
    validator(rule, value) {
      if (!value) {
        editCheck.value = false
        return new Error('请输入本地IP')
      } else if (
        !/(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))/.test(
          value
        )
      ) {
        editCheck.value = false
        return new Error('本地IP格式不合法')
      }
      editCheck.value = true
      return true
    }
  },
  local_port: {
    required: true,
    trigger: ['blur', 'input'],
    validator(rule, value) {
      if (!value) {
        editCheck.value = false
        return new Error('请输入本地端口')
      } else if (
        !/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
          value
        )
      ) {
        editCheck.value = false
        return new Error('本地端口格式不合法')
      }
      editCheck.value = true
      return true
    }
  },
  remote_port: {
    required: true,
    trigger: ['blur', 'input'],
    validator(rule, value) {
      if (!value) {
        editCheck.value = false
        return new Error('请输入远程端口')
      } else if (
        !/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
          value
        )
      ) {
        editCheck.value = false
        return new Error('远程端口格式不合法')
      }
      editCheck.value = true
      return true
    }
  },
  domain: {
    required: false,
    validator(rule, value) {
      if (!value) {
        editCheck.value = false
        return new Error('请输入域名')
      } else if (!/^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,6}$/.test(value)) {
        editCheck.value = false
        return new Error('域名格式不合法')
      }
      editCheck.value = true
      return true
    }
  }
}
const showDomainInput = ref(false)
const showSecretKeyInput = ref(false)

function proxyTypeSelectChangeHandle(value) {
  showDomainInput.value = value === '3' || value === '4'
  showSecretKeyInput.value = value === '5' || value === '6'
}

async function randomPort() {
  if (proxyInfo.value.node === 0) {
    sendErrorDialog('请先选择你需要的节点')
    return
  }
  let rs
  try {
    rs = await api.v1.Proxies.GetRandomPort(proxyInfo.value.node)
  } catch (e) {
    logger.error(e)
    sendErrorMessage('请求隧道端口失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    proxyInfo.value.remote_port = rs.data.port
  }
}

async function addProxy() {
  if (editCheck.value === false) {
    sendErrorDialog('参数检查未通过，请检查信息格式是否正确')
    return
  }
  const tunnelCreateInfo = {
    username: userData.getters.get_username,
    name: proxyInfo.value.proxy_name,
    key: userData.getters.get_frp_token,
    ip: proxyInfo.value.local_ip,
    type: proxyInfo.value.proxy_type,
    lp: proxyInfo.value.local_port,
    rp: proxyInfo.value.remote_port,
    ue: '0',
    uz: '0',
    id: proxyInfo.value.node,
    token: userData.getters.get_token,
    url: proxyInfo.value.domain,
    sk: proxyInfo.value.sk
  }
  let rs
  try {
    rs = await api.v2.proxies.add(
      tunnelCreateInfo.username,
      tunnelCreateInfo.name,
      tunnelCreateInfo.key,
      tunnelCreateInfo.ip,
      tunnelCreateInfo.type,
      tunnelCreateInfo.lp,
      tunnelCreateInfo.rp,
      tunnelCreateInfo.ue,
      tunnelCreateInfo.uz,
      tunnelCreateInfo.id,
      tunnelCreateInfo.token,
      tunnelCreateInfo.url,
      tunnelCreateInfo.sk
    )
  } catch (e) {
    logger.error(e)
    sendErrorMessage(e)
    sendErrorDialog('添加失败，再试一次吧~')
  }
  if (!rs) return
  if (rs.status === 200) {
    if (rs.statusApi === 200) {
      sendSuccessDialog('添加成功')
    } else {
      sendErrorMessage(rs.message)
    }
  } else {
    sendErrorMessage(rs.message)
  }
}

onMounted(async () => {
  let rs
  try {
    rs = await api.v2.nodes.list()
  } catch (e) {
    logger.error(e)
    sendErrorMessage('请求节点列表失败: ' + e)
  }
  if (!rs) return
  var i = 0
  rs.data.forEach((s) => {
    // 默认选择第一个节点
    if (i === 0) {
      proxyInfo.value.node = s.id
    }
    const tmpdict = {
      label: s.name,
      value: s.id
    }
    serverValue.value[s.id] = s
    serverList.value[i] = tmpdict
    i = i + 1
  })
})
</script>
