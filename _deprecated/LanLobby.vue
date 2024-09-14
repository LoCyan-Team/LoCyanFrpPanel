<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-page-facing-up"></i>
    <n-text type="primary">联机大厅</n-text>
  </n-h1>
  <n-alert title="关于联机大厅的通知" type="warning">
    该功能正在开发中暂不可用，我们后续会进行持续完善，期待该功能尽快与各位用户相见！
  </n-alert>
  <br />
  <n-grid cols="1" :y-gap="5">
    <n-gi span="1" item-responsive>
      <n-tabs :type="'line'" animated :placement="'top'">
        <n-tab-pane name="browser" tab="房间列表">
          <n-tabs
            :type="'line'"
            animated
            :placement="'left'"
            :default-value="'minecraft-java'"
            @update:value="handleUpdateValue"
          >
            <n-tab-pane v-for="i in gameList" :name="i.game_name" :tab="i.game_tab">
              <n-button type="primary" @click="getLobbys(i.game_name)">刷新</n-button>
              <br /><br />
              <n-grid cols="2" item-responsive y-gap="10" x-gap="10">
                <n-gi span="0:2 800:1" v-for="l in lobbyList">
                  <n-card :title="l.username + ' - ' + l.lobby_name">
                    <template #header-extra>
                      <n-tag type="success" v-if="l.need_client === '0'">不需要专有客户端</n-tag>
                      <n-tag type="warning" v-else>需要专有客户端</n-tag>
                      <n-tag type="info">{{ l.game_version }}</n-tag>
                    </template>
                    {{ l.description }}
                    <template #footer> 房间状态：开发中... </template>
                    <template #action>
                      <n-space justify="end">
                        <n-button
                          type="primary"
                          @click="
                            () => {
                              choseLobbyIndex = lobbyList.indexOf(l)
                              getAddress(
                                lobbyList[choseLobbyIndex].proxy_id,
                                lobbyList[choseLobbyIndex].node_id
                              )
                              showJoinLobby = true
                            }
                          "
                          >加入房间</n-button
                        >
                      </n-space>
                    </template>
                  </n-card>
                </n-gi>
              </n-grid>
            </n-tab-pane>
          </n-tabs>
        </n-tab-pane>
        <n-tab-pane name="create" tab="创建房间">
          <n-form :model="lobbyValue">
            <n-grid cols="2">
              <n-gi span="2">
                <n-form-item label="选择游戏类型" path="game_id">
                  <n-select
                    v-model:value="lobbyValue.game_id"
                    placeholder="Select"
                    :options="gameListSelect"
                  />
                </n-form-item>
                <n-form-item label="房间名" path="lobby_name">
                  <n-input v-model:value="lobbyValue.lobby_name" placeholder="Input" />
                </n-form-item>
                <n-form-item label="房间介绍" path="description">
                  <n-input
                    v-model:value="lobbyValue.description"
                    placeholder="Textarea"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                  />
                </n-form-item>
                <n-form-item label="是否需要专有客户端">
                  <n-radio-group
                    v-model:value="lobbyValue.need_client"
                    name="need_client"
                    :default-value="'no'"
                  >
                    <n-space>
                      <n-radio name="yes" value="1"> 需要 </n-radio>
                      <n-radio name="no" value="0"> 不需要 </n-radio>
                    </n-space>
                  </n-radio-group>
                </n-form-item>
                <div v-show="lobbyValue.need_client === '1'">
                  <n-form-item label="客户端下载地址" path="client_download_url">
                    <n-input v-model:value="lobbyValue.client_download_url" placeholder="Input" />
                  </n-form-item>
                  <n-form-item label="客户端下载方式">
                    <n-radio-group
                      v-model:value="lobbyValue.client_download_type"
                      name="client_download_type"
                      :default-value="'direct'"
                    >
                      <n-space>
                        <n-radio name="direct" value="direct"> 直接下载（直链） </n-radio>
                        <n-radio name="pan" value="pan"> 网盘 </n-radio>
                      </n-space>
                    </n-radio-group>
                  </n-form-item>
                  <n-form-item
                    label="下载密码"
                    path="client_download_password"
                    v-show="lobbyValue.client_download_type != 'direct'"
                  >
                    <n-input
                      v-model:value="lobbyValue.client_download_password"
                      placeholder="Input"
                    />
                  </n-form-item>
                </div>
                <n-form-item label="游戏版本" path="game_version">
                  <n-input v-model:value="lobbyValue.game_version" placeholder="Input" />
                </n-form-item>
                <n-form-item label="是否是使用了 LoCyanFrp 进行穿透的游戏">
                  <n-radio-group
                    v-model:value="lobbyValue.local"
                    name="local"
                    :default-value="'yes'"
                  >
                    <n-space>
                      <n-radio name="yes" value="1"> 是 </n-radio>
                      <n-radio name="pan" value="0"> 否 </n-radio>
                    </n-space>
                  </n-radio-group>
                </n-form-item>
                <div v-if="lobbyValue.local === '0'">
                  <n-form-item label="服务器IP" path="ip">
                    <n-input v-model:value="lobbyValue.ip" placeholder="Input" />
                  </n-form-item>
                  <n-form-item label="游戏端口" path="port">
                    <n-input v-model:value="lobbyValue.port" placeholder="Input" />
                  </n-form-item>
                </div>
                <div v-else>
                  <n-form-item label="所选隧道ID" path="proxy_id">
                    <n-select
                      v-model:value="lobbyValue.proxy_id"
                      placeholder="Select"
                      :options="Proxies_Select"
                    />
                  </n-form-item>
                  <n-form-item>
                    <n-button type="primary" @click="createLobby"> 提交 </n-button>
                  </n-form-item>
                </div>
              </n-gi>
            </n-grid>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="list" tab="我的房间">
          <n-grid cols="1" item-responsive>
            <n-gi span="1">
              <n-button type="primary" @click="getPrivateLobby">刷新</n-button>
              <br />
              <br />
              <n-list bordered>
                <template #header> 我的房间 </template>
                <n-list-item v-for="i in privateLobbyList">
                  <template #suffix>
                    <n-button type="error" @click="deleteLobby(i.id)">删除</n-button>
                  </template>
                  <n-thing :title="i.lobby_name" :description="i.description"> </n-thing>
                </n-list-item>
              </n-list>
            </n-gi>
          </n-grid>
        </n-tab-pane>
      </n-tabs>
    </n-gi>
  </n-grid>
  <n-modal
    v-model:show="showJoinLobby"
    class="custom-card"
    preset="card"
    :style="bodyStyle"
    title="房间信息"
    size="huge"
    :bordered="false"
    :segmented="segmented"
  >
    <n-alert title="通知" type="warning">
      加入房间功能目前只提供基本信息展示，其他功能（直接启动游戏，换皮肤，资源大厅）会在后续持续更新
    </n-alert>
    <n-p>房间名: {{ lobbyList[choseLobbyIndex].lobby_name }}</n-p>
    <n-p v-if="lobbyList[choseLobbyIndex].local == '1'">房间类型: LCF 隧道</n-p>
    <n-p v-else>房间类型: 自有 IP</n-p>
    <n-p v-if="lobbyList[choseLobbyIndex].local == '1'">连接地址: {{ connectAddress }}</n-p>
    <n-p v-else
      >连接地址: {{ lobbyList[choseLobbyIndex].ip }}:{{ lobbyList[choseLobbyIndex].port }}
    </n-p>
    <n-p v-if="lobbyList[choseLobbyIndex].need_client == '0'">专有客户端: 不需要</n-p>
    <n-p v-else>专有客户端: 需要 (客户端下载界面正在制作)</n-p>
  </n-modal>
</template>
<script setup>
import { ref } from 'vue'
import { get, post, deleteReq } from '@/utils/request'
import userData from '@/utils/stores/userData'
import { sendSuccessDialog } from '@/utils/dialog'

const bodyStyle = {
  width: '600px'
}
const segmented = {
  content: 'soft',
  footer: 'soft'
}

const gameList = ref([
  {
    game_name: '',
    create_time: '',
    game_tab: '',
    id: 0
  }
])

const choseLobbyIndex = ref(0)
const connectAddress = ref('')
const gameListSelect = ref([])
const lobbyList = ref([
  {
    id: 0,
    game_version: '',
    need_client: '',
    create_time: '',
    port: '',
    ip: '',
    lobby_name: '',
    local: '',
    description: '',
    proxy_id: '',
    game_id: '',
    username: '',
    node_id: '',
    client_download_url: '',
    client_download_type: '',
    client_download_password: '',
    status: 0
  }
])

const privateLobbyList = ref([
  {
    id: 0,
    game_version: '',
    need_client: '',
    create_time: '',
    port: '',
    ip: '',
    lobby_name: '',
    local: '',
    description: '',
    proxy_id: '',
    game_id: '',
    username: '',
    node_id: '',
    client_download_url: '',
    client_download_type: '',
    client_download_password: '',
    status: 0
  }
])

const lobbyValue = ref({
  id: 0,
  game_version: '',
  need_client: '',
  create_time: '',
  port: '',
  ip: '',
  lobby_name: '',
  local: '',
  description: '',
  proxy_id: '',
  game_id: '',
  node_id: '',
  client_download_url: '',
  client_download_type: '',
  client_download_password: '',
  username: userData.getters.get_username
})

const Proxies_Select = ref([])
const Proxies = ref([])
const showJoinLobby = ref(false)

function getGameList() {
  const rs = get('https://api-v2.locyanfrp.cn/api/v2/game/list')
  rs.then((res) => {
    if (res.status === 200) {
      gameList.value = res.data.list
      var i = 0
      res.data.list.forEach((e) => {
        const tmpDict = {
          label: e.game_tab,
          value: e.id
        }
        gameListSelect.value[i] = tmpDict
        i = i + 1
      })
    }
    getLobbys(gameList.value[0].game_name)
  })
}

function getLobbys(game_name) {
  const rs = get(
    'https://api-v2.locyanfrp.cn/api/v2/lan/public/getListByGameName?username=' +
      userData.getters.get_username +
      '&game_name=' +
      game_name
  )
  rs.then((res) => {
    if (res.status === 200) {
      lobbyList.value = res.data.list
    }
  })
}

function getPrivateLobby() {
  const rs = get(
    'https://api-v2.locyanfrp.cn/api/v2/lan/private/list?username=' + userData.getters.get_username
  )
  rs.then((res) => {
    if (res.status === 200) {
      privateLobbyList.value = res.data.list
    }
    console.log(privateLobbyList.value)
  })
}

function getProxyList() {
  const rs = get(
    'https://api-v2.locyanfrp.cn/api/v2/proxies/getlist?username=' +
      localStorage.getItem('username')
  )
  rs.then((res) => {
    if (res.status === 200) {
      var i = 0
      res.data.proxies.forEach((e) => {
        const tmpDict = {
          label: e.proxy_name,
          value: e.id
        }
        Proxies.value[e.id] = e
        Proxies_Select.value[i] = tmpDict
        i = i + 1
      })
    }
  })
}

function createLobby() {
  if (lobbyValue.value.local === '1') {
    lobbyValue.value.node_id = String(Proxies.value[lobbyValue.value.proxy_id].node)
  }
  const rs = post('https://api-v2.locyanfrp.cn/api/v2/lan/private/create', lobbyValue.value)
  rs.then((res) => {
    if (res.status === 200) {
      sendSuccessDialog('添加成功!')
    }
  })
}

function deleteLobby(id) {
  const rs = deleteReq(
    'https://api-v2.locyanfrp.cn/api/v2/lan/private/deleteReq?username=' +
      userData.getters.get_username +
      '&id=' +
      String(id)
  )
  rs.then((res) => {
    if (res.status === 200) {
      sendSuccessDialog('删除成功')
      getPrivateLobby()
    }
  })
}

function getAddress(proxyId, nodeId) {
  const rs = get(
    'https://api-v2.locyanfrp.cn/api/v2/lan/public/address?username=' +
      userData.getters.get_username +
      '&proxy_id=' +
      proxyId +
      '&node_id=' +
      nodeId
  )
  rs.then((res) => {
    if (res.status === 200) {
      connectAddress.value = res.data.address
    }
  })
}

function handleUpdateValue(value) {
  // console.log(value.value)
  getLobbys(value)
}
getGameList()
getProxyList()
getPrivateLobby()
</script>
