<template>
  <!-- 编辑隧道的模态框 -->
  <n-modal
    v-model:show="showEditModal"
    class="custom-card"
    preset="card"
    :style="bodyStyle"
    :title="'编辑隧道 - 隧道ID: ' + String(selectProxyID)"
    size="huge"
    :bordered="false"
    :segmented="segmented"
    :mask-closable="false"
  >
    <n-form :ref="formRef" :model="proxyEditInfo" :rules="rules" label-width="auto" size="large">
      <n-grid cols="2" item-responsive>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="选择服务器" path="node">
            <n-select v-model:value="proxyEditInfo.node" :options="editServerList" />
          </n-form-item>
          <template v-if="!serverList[proxyEditInfo.node]">
            <n-alert title="该隧道节点已下线" type="error"></n-alert>
            <br />
          </template>
          <n-form-item label="隧道名" path="proxy_name">
            <n-input v-model:value="proxyEditInfo.proxy_name" placeholder="隧道名" />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="穿透协议" path="proxy_type">
            <n-radio-group
              v-model:value="proxyEditInfo.proxy_type"
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
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="内网IP" path="local_ip">
            <n-input v-model:value="proxyEditInfo.local_ip" placeholder="内网IP，例如127.0.0.1" />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="内网端口" path="local_port">
            <n-input
              v-model:value="proxyEditInfo.local_port"
              placeholder="内网端口, HTTP:80 HTTPS:443 MC:25565/19136 泰拉瑞亚:7777"
            />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="远程端口" path="remote_port">
            <n-input
              v-model:value="proxyEditInfo.remote_port"
              placeholder="映射到远程服务器上的端口"
            />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="自定义域名" path="domain" v-show="showDomainInput">
            <n-input
              v-model:value="proxyEditInfo.domain"
              placeholder="HTTPS/HTTP需要填写，其他协议不需要填写"
            />
          </n-form-item>
        </n-grid-item>
      </n-grid>
    </n-form>
    <template #footer>
      <n-button
        style="margin: 2px"
        strong
        secondary
        type="primary"
        @click="editProxy(proxiesList[indexOfProxies].id)"
        >提交
      </n-button>
    </template>
  </n-modal>
  <!--查看详细信息的模态框 -->
  <n-modal
    v-model:show="showDetailModal"
    class="custom-card"
    preset="card"
    :style="bodyStyle"
    :title="'详细信息 - 隧道ID: ' + selectProxyID"
    size="huge"
    :bordered="false"
    :segmented="segmented"
  >
    <p>连接地址：{{ linkAddr }}</p>
    <p>服务器ID：{{ serverList[proxiesList[indexOfProxies].node_id].id }}</p>
    <p>服务器：{{ serverList[proxiesList[indexOfProxies].node_id].name }}</p>
    <p>服务器IP：{{ serverList[proxiesList[indexOfProxies].node_id].ip }}</p>
    <p>服务器域名：{{ serverList[proxiesList[indexOfProxies].node_id].hostname }}</p>
    <p>本地地址：{{ proxiesList[indexOfProxies].local_ip }}</p>
    <p>穿透协议：{{ proxiesList[indexOfProxies].proxy_type }}</p>
    <p>本地端口：{{ proxiesList[indexOfProxies].local_port }}</p>
    <p>远程端口：{{ proxiesList[indexOfProxies].remote_port }}</p>
    <p>绑定域名：{{ proxiesList[indexOfProxies].domain || '该隧道没有绑定域名' }}</p>
    <!-- 2024-06-03 13:01 Muska_Ami: 加一个隐藏防止意外泄露token -->
    简易启动命令：
    <n-tooltip placement="bottom" trigger="click">
      <template #trigger>
        <n-button> 点击显示/隐藏 </n-button>
      </template>
      <p>
        <span style="margin-right: 15px">
          {{ quickStartCommand }}
        </span>
        <!-- 2024-09-14 2:36 Muska-Ami: 这里不知道为啥复制不了 -->
        <!-- 2024-9-14 4:17 ltzXiaoYanMo: 大概v-clipboard的bug，这死吗玩意就死活不传入-->
        <!-- 2024-09-14 9:35 Muska-Ami: 我觉得是 NaiveUI 实现的问题 -->
        <n-button
          secondary
          type="primary"
          v-clipboard="() => quickStartCommand"
          v-clipboard:success="() => sendSuccessMessage('复制成功')"
          v-clipboard:error="() => sendErrorMessage('复制失败')"
        >
          复制
        </n-button>
      </p>
    </n-tooltip>
    <!-- <template #footer>
            </template> -->
  </n-modal>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-books"></i>
    <n-text type="primary"> 隧道列表</n-text>
  </n-h1>
  <n-spin :show="loading">
    <n-grid cols="4" item-responsive>
      <n-gi
        v-for="item in proxiesList"
        style="margin: 10px"
        span="0:4 950:1"
        :id="proxiesList.indexOf(item)"
      >
        <n-space style="display: block">
          <n-card style="min-height: 350px">
            <div style="overflow-y: auto; height: 75px" class="node-title">
              <h2 style="font-weight: 400">
                {{ item.proxy_name }}
                <n-tag :bordered="false" type="success" style="transform: translateY(-2px)">
                  ID: {{ item.id }}
                </n-tag>
              </h2>
            </div>
            <n-tag :bordered="false" type="success">
              {{ item.proxy_type.toUpperCase() }}
            </n-tag>
            <n-tag :bordered="false" type="info" v-if="serverList[item.node_id]">
              {{ serverList[item.node_id].name || '未知节点' }}
            </n-tag>
            <n-tag :bordered="false" type="error" v-else> 未知节点 </n-tag>
            <template #footer>
              <div v-if="serverList[item.node_id]">
                连接地址： <br />
                {{ makeLinkAddr(proxiesList.indexOf(item)) }}
              </div>
              <div v-else>
                连接地址： <br />
                节点已下线
              </div>
            </template>
            <template #action>
              <n-space>
                <!-- <p style="margin-top: 9px">操作：</p> -->
                <!-- index: 在点击编辑按钮时，将当前隧道对应的数组索引传递到变量中以便调用 -->
                <n-button
                  style="margin: 1px"
                  secondary
                  type="primary"
                  @click="
                    () => {
                      indexOfProxies = proxiesList.indexOf(item)
                      showEditModal = true
                      selectProxyID = item.id
                      proxyEditInfo = {
                        node: item.node_id,
                        id: selectProxyID,
                        proxy_name: item.proxy_name,
                        proxy_type: item.proxy_type,
                        local_ip: item.local_ip,
                        local_port: item.local_port.toString(),
                        remote_port: item.remote_port,
                        domain: item.domain
                      }
                      showDomainInput = item.proxy_type === 'http' || item.proxy_type === 'https'
                    }
                  "
                  >编辑
                </n-button>
                <!-- 这个click被我利用到极致了 -->
                <!-- JS大蛇你妈的也不套 () => {} 帮你套了下次别乱写了 -->
                <n-button
                  style="margin: 1px"
                  strong
                  secondary
                  type="info"
                  v-if="serverList[item.node_id]"
                  @click="
                    () => {
                      indexOfProxies = proxiesList.indexOf(item)
                      linkAddr = makeLinkAddr(proxiesList.indexOf(item))
                      showDetailModal = true
                      selectProxyID = item.id
                    }
                  "
                >
                  详细信息
                </n-button>
                <n-button
                  style="margin: 1px"
                  strong
                  secondary
                  type="warning"
                  v-if="serverList[item.node_id]"
                  @click="launchProxyThroughApplication(item.id)"
                >
                  一键启动
                </n-button>
                <n-button
                  style="margin: 1px"
                  strong
                  tertiary
                  type="warning"
                  @click="forceDownProxy(item.id)"
                >
                  强制下线
                </n-button>
                <n-button
                  style="margin: 1px"
                  strong
                  secondary
                  type="error"
                  @click="deleteProxy(proxiesList.indexOf(item))"
                  >删除
                </n-button>
              </n-space>
            </template>
          </n-card>
        </n-space>
      </n-gi>
    </n-grid>
  </n-spin>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useDialog } from 'naive-ui'
import userData from '@/utils/stores/userData/store'
import { sendErrorMessage, sendSuccessMessage } from '@/utils/message'
import { sendErrorDialog, sendSuccessDialog, sendWarningDialog } from '@/utils/dialog'
import api from '@/api'
import logger from '@/utils/logger'
import router from '@router'

const loading = ref(true)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const selectProxyID = ref(0)
const indexOfProxies = ref(0)
const dialog = useDialog()
const linkAddr = ref('')
const editServerList = ref([])
const bodyStyle = {
  width: '600px'
}
const segmented = {
  content: 'soft',
  footer: 'soft'
}
const editCheck = ref(true)

const quickStartCommand = computed(
  () => `./frpc -u ${userData.getters.get_frp_token} -p ${selectProxyID.value}`
)

// 隧道类型翻译
function transType(type) {
  let pt
  if (type === 'tcp') {
    pt = '1'
  } else if (type === 'udp') {
    pt = '2'
  } else if (type === 'http') {
    pt = '3'
  } else if (type === 'https') {
    pt = '4'
  } else if (type === 'xtcp') {
    pt = '5'
  } else if (type === 'stcp') {
    pt = '6'
  } else {
    pt = '1'
  }
  return pt
}

// 就是有弱智不知道隧道链接是什么，气死我了
// 2024-01-23 By Muska_Ami: ↑然而加了依然有弱智不知道
function makeLinkAddr(id) {
  if (proxiesList.value[id].proxy_type === 'http' || proxiesList.value[id].proxy_type === 'https') {
    return proxiesList.value[id].domain
  } else {
    return (
      serverList.value[proxiesList.value[id].node_id].hostname +
      ':' +
      proxiesList.value[id].remote_port
    )
  }
}

async function launchProxyThroughApplication(id) {
  dialog.success({
    title: '通知',
    content: '该功能需要配合 C# 客户端或 NyaLCF 使用!',
    positiveText: '已经安装好了',
    negativeText: '没安装...',
    onPositiveClick: () => {
      const url = 'locyanfrp://' + userData.getters.get_frp_token + '/' + id
      window.open(url)
    },
    onNegativeClick: () => {
      router.push('/other/software')
    },
    onMaskClick: () => {
      sendSuccessMessage('你取消了操作！')
    }
  })
}

async function forceDownProxy(proxyId) {
  dialog.warning({
    title: '警告',
    content: '确认要强制下线隧道吗？这将会使该隧道下线',
    positiveText: '确认',
    negativeText: '还是算了吧~',
    onPositiveClick: async () => {
      let rs
      try {
        rs = await api.v2.proxy.down(userData.getters.get_username, proxyId)
      } catch (e) {
        logger.error(e)
        sendErrorMessage(`请求强制下线隧道失败: ${e}`)
      }
      if (!rs) return
      if (rs.status === 200) {
        sendSuccessMessage('已发送隧道下线指令')
      }
    },
    onMaskClick: () => {
      sendSuccessMessage('你取消了操作！')
    }
  })
}

async function editProxy(proxyid) {
  if (editCheck.value === false) {
    sendWarningDialog('参数检查未通过，请检查信息格式是否正确！')
  }

  const editInfo = {
    id: proxyid,
    proxyName: proxyEditInfo.value.proxy_name,
    proxyType: proxyEditInfo.value.proxy_type,
    remotePort: proxyEditInfo.value.remote_port,
    localIp: proxyEditInfo.value.local_ip,
    localPort: proxyEditInfo.value.local_port,
    domain: proxyEditInfo.value.domain,
    node: proxyEditInfo.value.node
  }
  let rs
  try {
    rs = await api.v2.proxy.update(
      userData.getters.get_username,
      editInfo.id,
      editInfo.proxyName,
      editInfo.proxyType,
      editInfo.localIp,
      editInfo.localPort,
      editInfo.remotePort,
      false,
      false,
      editInfo.node,
      editInfo.domain,
      null
    )
  } catch (e) {
    sendErrorMessage('请求修改隧道信息失败: ' + e)
    sendErrorDialog('修改隧道信息失败，再试一次吧~')
  }
  if (!rs) return
  if (rs.status === 200) {
    // 重新刷新列表
    await initList()
    // 关闭模态框
    showEditModal.value = false
    sendSuccessDialog('修改成功')
  } else {
    sendErrorDialog(rs.message)
  }
}

const rules = {
  proxy_name: {
    required: true,
    trigger: ['blur', 'input'],
    validator(rule, value) {
      if (!value) {
        editCheck.value = false
        return new Error('请输入隧道名')
      } else if (!/[A-Za-z0-9_]$/.test(value)) {
        editCheck.value = false
        return new Error('隧道名格式错误，由字母、数字和下划线组成！')
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
        return new Error('请输入本地 IP')
      } else if (
        !/(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))/.test(
          value
        )
      ) {
        editCheck.value = false
        return new Error('本地 IP 格式不合法！')
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
        return new Error('请输入本地端口！')
      } else if (
        !/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
          value
        )
      ) {
        editCheck.value = false
        return new Error('本地端口格式不合法！')
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
        return new Error('请输入远程端口！')
      } else if (
        !/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
          value
        )
      ) {
        editCheck.value = false
        return new Error('远程端口格式不合法！')
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
        return new Error('请输入域名！')
      } else if (!/^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,6}$/.test(value)) {
        editCheck.value = false
        return new Error('域名格式不合法！')
      }
      editCheck.value = true
      return true
    }
  }
}

const showDomainInput = ref(false)

function proxyTypeSelectChangeHandle(value) {
  showDomainInput.value = value === 'http' || value === 'https'
}

const proxiesList = ref([])
const serverList = ref([
  {
    id: 0,
    name: '',
    description: '',
    ip: '',
    hostname: '',
    status: ''
  }
])

async function initList() {
  let rs1
  try {
    rs1 = await api.v2.node.all()
  } catch (e) {
    sendErrorMessage('请求节点列表失败: ' + e)
  }
  if (!rs1) return
  let i = 0
  rs1.data.list.forEach((s) => {
    editServerList.value[i] = {
      label: s.name,
      value: s.id
    }
    serverList.value[s.id] = s
    i = i + 1
  })

  let rs2
  try {
    rs2 = await api.v2.proxy.all(userData.getters.get_username)
  } catch (e) {
    sendErrorMessage('请求隧道列表失败: ' + e)
  }
  if (!rs2) return
  if (rs2.status === 200) {
    proxiesList.value = rs2.data.list
    loading.value = false
  } else {
    return rs2.data
  }
}

initList()

// 表格数据
const formRef = ref(null)
// 表单数据集合
const proxyEditInfo = ref({
  node: 0,
  id: 0,
  proxy_name: '',
  proxy_type: '1',
  local_ip: '',
  local_port: '',
  remote_port: '',
  domain: ''
})

function deleteProxy(id) {
  dialog.warning({
    title: '警告',
    content: '你确定要删除这个隧道吗？（隧道 ID：' + proxiesList.value[id].id + '）',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      let rs
      try {
        rs = await api.v2.proxy.root.delete(userData.getters.get_username, proxiesList.value[id].id)
      } catch (e) {
        sendErrorMessage('请求删除隧道失败: ' + e)
      }
      if (!rs) return
      if (rs.status === 200) {
        sendSuccessMessage('删除成功！')
        proxiesList.value.splice(id, 1)
      } else {
        sendErrorMessage(rs.message)
      }
    },
    onNegativeClick: () => {
      sendSuccessMessage('你取消了操作！')
    },
    onMaskClick: () => {
      sendSuccessMessage('你取消了操作！')
    }
  })
}
</script>

<style scoped>
.node-title::-webkit-scrollbar {
  display: none;
}
</style>
