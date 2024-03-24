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
          <n-tabs :type="'line'" animated :placement="'left'" :default-value="'minecraft-java'"
            @update:value="handleUpdateValue">
            <n-tab-pane v-for="i in gameList" :name="i.game_name" :tab="i.game_tab">
              <n-grid cols="3" item-responsive y-gap="10" x-gap="10">
                <n-gi span="0:3 1000:1" v-for="l in lobbyList">
                  <n-card :title="store.getters.get_username + ' - ' + l.lobby_name">
                    <template #header-extra>
                      <n-tag type="success" v-if="l.need_client === '0'">不需要专有客户端</n-tag>
                      <n-tag type="warning" v-else>需要专有客户端</n-tag>

                      <n-tag type="info">{{ l.game_version }}</n-tag>
                    </template>
                    {{ l.description }}
                    <template #footer>
                      房间状态：开发中...
                    </template>
                    <template #action>
                      <n-space justify="end">
                        <n-button type="primary">加入房间</n-button>
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
                  <n-select v-model:value="lobbyValue.game_id" placeholder="Select" :options="gameListSelect" />
                </n-form-item>
                <n-form-item label="房间名" path="lobby_name">
                  <n-input v-model:value="lobbyValue.lobby_name" placeholder="Input" />
                </n-form-item>
                <n-form-item label="房间介绍" path="description">
                  <n-input v-model:value="lobbyValue.description" placeholder="Textarea" type="textarea"
                    :autosize="{ minRows: 3, maxRows: 5 }" />
                </n-form-item>
                <n-form-item label="是否需要专有客户端">
                  <n-radio-group v-model:value="lobbyValue.need_client" name="need_client" :default-value="'no'">
                    <n-space>
                      <n-radio name="yes" value="1">
                        需要
                      </n-radio>
                      <n-radio name="no" value="0">
                        不需要
                      </n-radio>
                    </n-space>
                  </n-radio-group>
                </n-form-item>
                <div v-show="lobbyValue.need_client === '1'">
                  <n-form-item label="客户端下载地址" path="client_download_url">
                    <n-input v-model:value="lobbyValue.client_download_url" placeholder="Input" />
                  </n-form-item>
                  <n-form-item label="客户端下载方式">
                    <n-radio-group v-model:value="lobbyValue.client_download_type" name="client_download_type"
                      :default-value="'direct'">
                      <n-space>
                        <n-radio name="direct" value="direct">
                          直接下载（直链）
                        </n-radio>
                        <n-radio name="pan" value="pan">
                          网盘
                        </n-radio>
                      </n-space>
                    </n-radio-group>
                  </n-form-item>
                  <n-form-item label="下载密码" path="client_download_password"
                    v-show="lobbyValue.client_download_type != 'direct'">
                    <n-input v-model:value="lobbyValue.client_download_password" placeholder="Input" />
                  </n-form-item>
                </div>
                <n-form-item label="游戏版本" path="game_version">
                  <n-input v-model:value="lobbyValue.game_version" placeholder="Input" />
                </n-form-item>
                <n-form-item label="是否是使用了 LoCyanFrp 进行穿透的游戏">
                  <n-radio-group v-model:value="lobbyValue.local" name="local" :default-value="'yes'">
                    <n-space>
                      <n-radio name="yes" value="1">
                        是
                      </n-radio>
                      <n-radio name="pan" value="0">
                        否
                      </n-radio>
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
                    <n-select v-model:value="lobbyValue.proxy_id" placeholder="Select" :options="Proxies_Select" />
                  </n-form-item>
                  <n-form-item>
                    <n-button type="primary" @click="createLobby">
                      提交
                    </n-button>
                  </n-form-item>
                </div>
              </n-gi>
            </n-grid>
          </n-form>
        </n-tab-pane>
      </n-tabs>

    </n-gi>
  </n-grid>
</template>
<script setup>
import { ref } from "vue";
import { get, post } from "../utils/request";
import store from '../utils/stores/store.js';
import { sendErrorMessage, sendSuccessMessage } from '../utils/message';
import { SendErrorDialog, SendSuccessDialog, SendWarningDialog } from '../utils/dialog.js';

const gameList = ref([{
  game_name: '',
  create_time: '',
  game_tab: '',
  id: 0,
}]);

const gameListSelect = ref([]);
const lobbyList = ref([{
  game_version: "",
  need_client: "",
  create_time: "",
  port: "",
  ip: "",
  lobby_name: "",
  local: "",
  description: "",
  proxy_id: "",
  game_id: "",
  node_id: "",
  client_download_url: "",
  client_download_type: "",
  client_download_password: ""
}])


const lobbyValue = ref({
  game_version: "",
  need_client: "",
  create_time: "",
  port: "",
  ip: "",
  lobby_name: "",
  local: "",
  description: "",
  proxy_id: "",
  game_id: "",
  node_id: "",
  client_download_url: "",
  client_download_type: "",
  client_download_password: "",
  username: store.getters.get_username
})
const Proxies_Select = ref([])
const Proxies = ref([])

function getGameList() {
  const rs = get("https://api-v2.locyanfrp.cn/api/v2/game/list");
  rs.then((res) => {
    if (res.status === 200) {
      gameList.value = res.data.list;
      var i = 0;
      res.data.list.forEach((e) => {
        const tmpDict = {
          label: e.game_tab,
          value: e.id
        }
        gameListSelect.value[i] = tmpDict;
        i = i + 1
      })
    }
    getLobbys(gameList.value[0].game_name)
  })
}

function getLobbys(game_name) {
  const rs = get("https://api-v2.locyanfrp.cn/api/v2/lan/public/getListByGameName?username=" + store.getters.get_username + "&game_name=" + game_name);
  rs.then((res) => {
    if (res.status === 200) {
      lobbyList.value = res.data.list;
    }
  })
}

function getProxyList() {
  const rs = get(
    'https://api-v2.locyanfrp.cn/api/v2/proxies/getlist?username=' +
    localStorage.getItem('username')
  )
  rs.then((res) => {
    if (res.status === 200) {
      var i = 0;
      res.data.proxies.forEach((e) => {
        const tmpDict = {
          label: e.proxy_name,
          value: e.id
        };
        Proxies.value[e.id] = e;
        Proxies_Select.value[i] = tmpDict;
        i = i + 1;
      })
      console.log(Proxies_Select);
    }
  })
}

function createLobby() {
  if (lobbyValue.value.local === "1"){
    lobbyValue.value.node_id = String(Proxies.value[lobbyValue.value.proxy_id].node);
  }
  const rs = post("http://127.0.0.1:8080/api/v2/lan/private/create", lobbyValue.value);
  rs.then((res) => {
    if (res.status === 200) {
      SendSuccessDialog("添加成功!");
    }
  })
}

function handleUpdateValue(value) {
  getLobbys(value)
}
getGameList();
getProxyList();
</script>
