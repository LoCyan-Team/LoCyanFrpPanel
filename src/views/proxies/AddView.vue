<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-writing-hand-light-skin-tone"></i>
    <n-text type="primary"> 添加隧道</n-text>
  </n-h1>
  <n-form :ref="formRef" :model="proxyInfo" :rules="rules" label-width="auto" size="large">
    <n-space vertical>
      <n-form-item label="选择服务器" path="node">
        <n-select v-model:value="proxyInfo.nodeId" :options="serverList" size="medium" />
      </n-form-item>
    </n-space>
    <div id="item">
      <p>服务器信息：</p>
      <p>服务器名：{{ serverValue[proxyInfo.nodeId].name }}</p>
      <p>服务器介绍：{{ serverValue[proxyInfo.nodeId].description }}</p>
      <p>服务器IP：{{ serverValue[proxyInfo.nodeId].ip }}</p>
      <p>服务器域名：{{ serverValue[proxyInfo.nodeId].hostname }}</p>
    </div>
    <br />
    <n-grid x-gap="12" cols="2" item-responsive>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="隧道名" path="proxyName">
          <n-input v-model:value="proxyInfo.proxyName" placeholder="隧道名" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="穿透协议" path="proxyType">
          <n-radio-group
            v-model:value="proxyInfo.proxyType"
            @update:value="proxyTypeSelectChangeHandle"
          >
            <n-radio-button value="tcp"> TCP</n-radio-button>
            <n-radio-button value="udp"> UDP</n-radio-button>
            <n-radio-button value="http"> HTTP</n-radio-button>
            <n-radio-button value="https"> HTTPS</n-radio-button>
            <n-radio-button value="xtcp"> XTCP</n-radio-button>
            <n-radio-button value="stcp"> STCP</n-radio-button>
          </n-radio-group>
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="内网IP" path="localIp">
          <n-input v-model:value="proxyInfo.localIp" placeholder="内网IP, 例如127.0.0.1" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="内网端口" path="localPort">
          <n-input
            v-model:value="proxyInfo.localPort"
            placeholder="内网端口, HTTP:80 HTTPS:443 MC:25565/19132 泰拉瑞亚:7777"
          />
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="0:2 1000:1" id="item">
        <n-form-item label="远程端口" path="remotePort">
          <n-input
            v-model:value="proxyInfo.remotePort"
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
        <n-form-item label="访问密钥" path="secretKey" v-show="showSecretKeyInput">
          <n-input
            v-model:value="proxyInfo.secretKey"
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
import userData from '@/utils/stores/userData/store'
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
  nodeId: 0,
  proxyName: '',
  proxyType: 'tcp',
  localIp: '127.0.0.1',
  localPort: null,
  remotePort: null,
  domain: '',
  secretKey: ''
})
const editCheck = ref(false)
const rules = {
  proxyName: {
    required: true,
    trigger: ['blur', 'input'],
    validator(rule, value) {
      if (!value) {
        editCheck.value = false
        return new Error('请输入隧道名')
      } else if (!/^[a-zA-Z0-9_]{1,16}$/.test(value)) {
        editCheck.value = false
        return new Error('隧道名格式错误，由字母，数字和下划线组成')
      }
      editCheck.value = true
      return true
    }
  },
  proxyType: {
    required: true
  },
  localIp: {
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
  localPort: {
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
  remotePort: {
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
  showDomainInput.value = value === 'http' || value === 'https'
  showSecretKeyInput.value = value === 'xtcp' || value === 'stcp'
}

async function randomPort() {
  if (proxyInfo.value.nodeId === 0) {
    sendErrorDialog('请先选择你需要的节点')
    return
  }
  let rs
  try {
    rs = await api.v1.Proxies.GetRandomPort(proxyInfo.value.nodeId)
  } catch (e) {
    logger.error(e)
    sendErrorMessage('请求隧道端口失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    proxyInfo.value.remotePort = rs.data.port
  }
}

async function addProxy() {
  if (editCheck.value === false) {
    sendErrorDialog('参数检查未通过，请检查信息格式是否正确')
    return
  }
  const tunnelCreateInfo = {
    username: userData.getters.get_username,
    name: proxyInfo.value.proxyName,
    localIp: proxyInfo.value.localIp,
    proxyType: proxyInfo.value.proxyType,
    localPort: proxyInfo.value.localPort,
    remotePort: proxyInfo.value.remotePort,
    useEncryption: false,
    useCompression: false,
    nodeId: proxyInfo.value.nodeId,
    domain: proxyInfo.value.domain,
    secretKey: proxyInfo.value.secretKey
  }
  let rs
  try {
    rs = await api.v2.proxy.root.post(
      tunnelCreateInfo.username,
      tunnelCreateInfo.name,
      tunnelCreateInfo.localIp,
      tunnelCreateInfo.proxyType,
      tunnelCreateInfo.localPort,
      tunnelCreateInfo.remotePort,
      tunnelCreateInfo.nodeId,
      tunnelCreateInfo.useEncryption,
      tunnelCreateInfo.useCompression,
      tunnelCreateInfo.secretKey,
      tunnelCreateInfo.domain
    )
  } catch (e) {
    logger.error(e)
    sendErrorMessage(e)
    sendErrorDialog('添加失败，再试一次吧~')
  }
  if (!rs) return
  if (rs.status === 200) {
    sendSuccessDialog('添加成功')
  } else {
    sendErrorMessage(rs.message)
  }
}

onMounted(async () => {
  let rs
  try {
    rs = await api.v2.node.all()
  } catch (e) {
    logger.error(e)
    sendErrorMessage('请求节点列表失败: ' + e)
  }
  if (!rs) return
  var i = 0
  rs.data.list.forEach((s) => {
    // 默认选择第一个节点
    if (i === 0) {
      proxyInfo.value.nodeId = s.id
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
