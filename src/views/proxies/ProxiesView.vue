<template>
  <!-- 编辑隧道的模态框 -->
  <n-modal
    v-model:show="showEditModal"
    class="custom-card"
    preset="card"
    style="max-width: 600px"
    :title="'编辑隧道 - ID: ' + String(selectProxyID)"
    size="huge"
    :bordered="false"
    :segmented="segmented"
    :mask-closable="false"
  >
    <n-form :ref="formRef" :model="proxyEditInfo" :rules="rules" label-width="auto" size="large">
      <n-grid cols="2" item-responsive>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="选择服务器" path="nodeId">
            <n-select v-model:value="proxyEditInfo.nodeId" :options="editServerList" />
          </n-form-item>
          <template v-if="!serverList[proxyEditInfo.nodeId]">
            <n-alert title="该隧道节点已下线" type="error"></n-alert>
            <br />
          </template>
          <n-form-item label="隧道名" path="proxyName">
            <n-input v-model:value="proxyEditInfo.proxyName" placeholder="隧道名" />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="穿透协议" path="proxyType">
            <n-scrollbar x-scrollable>
              <n-radio-group
                v-model:value="proxyEditInfo.proxyType"
                @update:value="proxyTypeSelectChangeHandle"
              >
                <n-radio-button value="tcp">TCP</n-radio-button>
                <n-radio-button value="udp">UDP</n-radio-button>
                <n-radio-button value="http">HTTP</n-radio-button>
                <n-radio-button value="https">HTTPS</n-radio-button>
                <n-radio-button value="xtcp">XTCP</n-radio-button>
                <n-radio-button value="stcp">STCP</n-radio-button>
              </n-radio-group>
            </n-scrollbar>
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="内网IP" path="localIp">
            <n-input v-model:value="proxyEditInfo.localIp" placeholder="内网IP，例如127.0.0.1" />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="内网端口" path="localPort">
            <n-input
              v-model:value="proxyEditInfo.localPort"
              placeholder="内网端口, HTTP:80 HTTPS:443 MC:25565/19136 泰拉瑞亚:7777"
            />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1" v-if="showRemotePortInput">
          <n-form-item label="远程端口" path="remotePort">
            <n-input
              v-model:value="proxyEditInfo.remotePort"
              placeholder="映射到远程服务器上的端口"
            />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1" v-if="showDomainInput">
          <n-form-item label="自定义域名" path="domain">
            <n-input
              v-model:value="proxyEditInfo.domain"
              placeholder="HTTPS/HTTP需要填写，其他协议不需要填写"
            />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1" id="item" v-if="showSecretKeyInput">
          <n-form-item label="访问密钥" path="secretKey">
            <n-input
              v-model:value="proxyEditInfo.secretKey"
              placeholder="XTCP / STCP 需要填写, 其他协议不需要填写"
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
        type="success"
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
    style="max-width: 600px"
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
          type="success"
          v-clipboard="() => quickStartCommand"
          v-clipboard:success="() => message.success('复制成功')"
          v-clipboard:error="() => message.error('复制失败')"
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
    <n-text type="success"> 隧道列表</n-text>
  </n-h1>
  <n-spin :show="loading">
    <n-empty v-if="proxiesList.length === 0" description="一个隧道都没找到哦~"></n-empty>
    <div v-else>
      <div style="margin-left: 0.3rem; margin-bottom: 1rem">
        <n-switch :round="false" @update:value="(val) => (listMode = val)">
          <template #checked>列表模式</template>
          <template #unchecked>列表模式</template>
        </n-switch>
      </div>
      <div v-if="listMode">
        <n-scrollbar x-scrollable>
          <n-table style="min-width: 800px" :bordered="true" :single-line="false">
            <n-thead>
              <n-tr>
                <n-th>隧道 ID</n-th>
                <n-th>隧道名</n-th>
                <n-th>隧道节点</n-th>
                <n-th>隧道协议</n-th>
                <n-th>连接地址</n-th>
                <n-th>操作</n-th>
              </n-tr>
            </n-thead>
            <n-tbody>
              <n-tr v-for="item in proxiesList" :id="proxiesList.indexOf(item)">
                <n-td>{{ item.id }}</n-td>
                <n-td>{{ item.proxy_name }}</n-td>

                <n-td v-if="serverList[item.node_id]">{{
                  serverList[item.node_id].name || '未知节点'
                }}</n-td>
                <n-td v-else>未知节点</n-td>

                <n-td>{{ item.proxy_type.toUpperCase() }}</n-td>

                <n-td v-if="serverList[item.node_id]">{{
                  makeLinkAddr(proxiesList.indexOf(item))
                }}</n-td>
                <n-td v-else></n-td>

                <n-td>
                  <n-spin
                    :show="item.status < 0"
                    style="
                      width: 100%;
                      --disable-color: #d90303;
                      --n-color: var(--disable-color);
                      --n-text-color: var(--disable-color);
                    "
                    :rotate="false"
                  >
                    <template #icon>
                      <n-icon>
                        <Error />
                      </n-icon>
                    </template>
                    <n-space>
                      <!-- <p style="margin-top: 9px">操作：</p> -->
                      <!-- index: 在点击编辑按钮时，将当前隧道对应的数组索引传递到变量中以便调用 -->
                      <n-button
                        style="margin: 1px"
                        secondary
                        type="success"
                        @click="
                          () => {
                            indexOfProxies = proxiesList.indexOf(item)
                            showEditModal = true
                            selectProxyID = item.id
                            proxyEditInfo = {
                              nodeId: item.node_id,
                              proxyId: selectProxyID,
                              proxyName: item.proxy_name,
                              proxyType: item.proxy_type,
                              localIp: item.local_ip,
                              localPort: item.local_port.toString(),
                              remotePort: item.remote_port,
                              domain: item.domain,
                              secretKey: item.secret_key
                            }
                            showDomainInput =
                              item.proxy_type === 'http' || item.proxy_type === 'https'
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
                    </n-space>
                  </n-spin>
                </n-td>
              </n-tr>
            </n-tbody>
          </n-table>
        </n-scrollbar>
      </div>
      <div v-else>
        <n-grid cols="4" item-responsive>
          <n-gi
            v-for="item in proxiesList"
            style="margin: 10px"
            span="0:4 950:1"
            :id="proxiesList.indexOf(item)"
          >
            <n-space style="display: block">
              <n-spin
                :show="item.status < 0"
                style="
                  --disable-color: #d90303;
                  --n-color: var(--disable-color);
                  --n-text-color: var(--disable-color);
                "
                :rotate="false"
              >
                <template #icon>
                  <n-icon>
                    <Error />
                  </n-icon>
                </template>
                <template #description> 隧道已被禁用 </template>
                <n-card style="min-height: 350px">
                  <div style="overflow-y: auto; height: 75px" class="nodeId-title">
                    <n-h2 style="font-weight: 400">
                      {{ item.proxy_name }}
                      <n-tag :bordered="false" type="success" style="transform: translateY(-2px)">
                        ID: {{ item.id }}
                      </n-tag>
                    </n-h2>
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
                        type="success"
                        @click="
                          () => {
                            indexOfProxies = proxiesList.indexOf(item)
                            showEditModal = true
                            selectProxyID = item.id
                            proxyEditInfo = {
                              nodeId: item.node_id,
                              proxyId: selectProxyID,
                              proxyName: item.proxy_name,
                              proxyType: item.proxy_type,
                              localIp: item.local_ip,
                              localPort: item.local_port.toString(),
                              remotePort: item.remote_port,
                              domain: item.domain
                            }
                            proxyTypeSelectChangeHandle(item.proxy_type)
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
              </n-spin>
            </n-space>
          </n-gi>
        </n-grid>
      </div>
    </div>
  </n-spin>
</template>

<script setup>
import { Error } from '@vicons/carbon'

import { computed, ref } from 'vue'
import userData from '@/utils/stores/userData/store'
import Message from '@/utils/message'
import Dialog from '@/utils/dialog'
import API from '@/api'
import logger from '@/utils/logger'
import router from '@/router'

const api = new API()
const message = new Message()
const dialog = new Dialog()

const loading = ref(true)
const listMode = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const selectProxyID = ref(0)
const indexOfProxies = ref(0)
const linkAddr = ref('')
const editServerList = ref([])
const segmented = {
  content: 'soft',
  footer: 'soft'
}
const editCheck = ref(true)

const quickStartCommand = computed(
  () => `./frpc -u ${userData.getters.get_frp_token} -p ${selectProxyID.value}`
)

// 就是有弱智不知道隧道链接是什么，气死我了
// 2024-01-23 By Muska_Ami: ↑然而加了依然有弱智不知道
function makeLinkAddr(id) {
  switch (proxiesList.value[id].proxy_type) {
    case 'http':
    case 'https':
      return proxiesList.value[id].domain
    case 'xtcp':
    case 'stcp':
      return '无'
    default:
      return (
        serverList.value[proxiesList.value[id].node_id].hostname +
        ':' +
        proxiesList.value[id].remote_port
      )
  }
}

async function launchProxyThroughApplication(id) {
  dialog.success('该功能需要配合 C# 客户端或 NyaLCF 使用!', {
    onPositiveClick: async () => {
      const url = 'locyanfrp://' + userData.getters.get_frp_token + '/' + id
      window.open(url)
    },
    onNegativeClick: () => {
      router.push({ name: 'Software' })
    }
  })
}

async function forceDownProxy(proxyId) {
  dialog.warning('确认要强制下线隧道吗？这将会使该隧道下线', {
    onPositiveClick: async () => {
      let rs
      try {
        rs = await api.v2.proxy.down.post({
          userId: userData.getters.get_user_id,
          proxyId: proxyId
        })
      } catch (e) {
        logger.error(e)
        message.error(`请求强制下线隧道失败: ${e}`)
      }
      if (!rs) return
      if (rs.status === 200) {
        message.success('已发送隧道下线指令')
      }
    }
  })
}

async function editProxy(proxyId) {
  if (editCheck.value === false) {
    message.warning('参数检查未通过，请检查信息格式是否正确！')
  }

  const editInfo = {
    proxyId: proxyId,
    proxyName: proxyEditInfo.value.proxyName,
    proxyType: proxyEditInfo.value.proxyType,
    remotePort: proxyEditInfo.value.remotePort,
    localIp: proxyEditInfo.value.localIp,
    localPort: proxyEditInfo.value.localPort,
    domain: proxyEditInfo.value.domain,
    nodeId: proxyEditInfo.value.nodeId,
    secretKey: proxyEditInfo.value.secretKey
  }
  let rs
  try {
    rs = await api.v2.proxy.update.post({
      userId: userData.getters.get_user_id,
      proxyId: editInfo.proxyId,
      proxyName: editInfo.proxyName,
      proxyType: editInfo.proxyType,
      localIp: editInfo.localIp,
      localPort: editInfo.localPort,
      remotePort: editInfo.remotePort,
      useEncryption: false,
      useCompression: false,
      nodeId: editInfo.nodeId,
      domain: editInfo.domain,
      secretKey: editInfo.secretKey
    })
  } catch (e) {
    message.error('请求修改隧道信息失败: ' + e)
    dialog.error('修改隧道信息失败，再试一次吧~')
  }
  if (!rs) return
  if (rs.status === 200) {
    // 重新刷新列表
    await initList()
    // 关闭模态框
    showEditModal.value = false
    message.success('修改成功')
  } else {
    message.error(rs.message)
  }
}

const rules = {
  proxyName: {
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
  proxyType: {
    required: true
  },
  localIp: {
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
  localPort: {
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
  remotePort: {
    required: false,
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

const showRemotePortInput = ref(true),
  showDomainInput = ref(true),
  showSecretKeyInput = ref(true)

function proxyTypeSelectChangeHandle(value) {
  showRemotePortInput.value =
    value !== 'http' && value !== 'https' && value !== 'xtcp' && value !== 'stcp'
  showDomainInput.value = value === 'http' || value === 'https'
  showSecretKeyInput.value = value === 'xtcp' || value === 'stcp'
}

const proxiesList = ref([])
const serverList = ref([])

async function initList() {
  let rs1
  try {
    rs1 = await api.v2.node.all.get({
      userId: userData.getters.get_user_id
    })
  } catch (e) {
    message.error('请求节点列表失败: ' + e)
  }
  if (!rs1) return
  let i = 0
  const list = rs1.data.list
  list.sort((a, b) => {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  })
  list.forEach((s) => {
    editServerList.value[i] = {
      label: s.name,
      value: s.id
    }
    serverList.value[s.id] = {
      id: s.id,
      name: s.name,
      description: s.description,
      ip: s.ip,
      hostname: s.hostname,
      status: s.status,
      attribute: {
        china: s.attribute.china,
        allowBigTraffic: s.attribute.allow_big_traffic,
        allowUdp: s.attribute.allow_udp,
        allowWebsite: s.attribute.allow_website
      },
      portRange: s.port_range
    }
    i = i + 1
  })

  let rs2
  try {
    rs2 = await api.v2.proxy.all.get({
      userId: userData.getters.get_user_id
    })
  } catch (e) {
    message.error('请求隧道列表失败: ' + e)
  }
  if (!rs2) return
  if (rs2.status === 200) {
    proxiesList.value = rs2.data.list
    loading.value = false
  } else if (rs2.status === 404) {
    loading.value = false
    // sendErrorMessage('你还没有隧道，先创建一个吧？')
  } else {
    message.error(rs2.message)
  }
}

initList()

// 表格数据
const formRef = ref(null)
// 表单数据集合
const proxyEditInfo = ref({
  nodeId: 0,
  proxyId: 0,
  proxyName: '',
  proxyType: '1',
  localIp: '',
  localPort: '',
  remotePort: '',
  domain: ''
})

function deleteProxy(id) {
  dialog.warning(`你确定要删除这个隧道吗？（隧道 ID：${proxiesList.value[id].id}）`, {
    onPositiveClick: async () => {
      loading.value = true
      let rs
      try {
        rs = await api.v2.proxy.delete({
          userId: userData.getters.get_user_id,
          proxyId: proxiesList.value[id].id
        })
      } catch (e) {
        message.error('请求删除隧道失败: ' + e)
        loading.value = false
      }
      if (!rs) return
      if (rs.status === 200) {
        message.success('删除成功！')
        proxiesList.value.splice(id, 1)
      } else {
        message.error(rs.message)
      }
      loading.value = false
    }
  })
}
</script>

<style scoped>
.nodeId-title::-webkit-scrollbar {
  display: none;
}
</style>
