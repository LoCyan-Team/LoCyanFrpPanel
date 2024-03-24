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
                  <n-card :title="store.getters.get_username + ' - ' + l.name">
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
                <n-form-item label="房间名" path="name">
                  <n-input v-model:value="lobbyValue.name" placeholder="Input" />
                </n-form-item>
                <n-form-item label="房间介绍" path="description">
                  <n-input v-model:value="lobbyValue.description" placeholder="Textarea" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" />
                </n-form-item>
              </n-gi>
            </n-grid>
          </n-form>
        </n-tab-pane>
      </n-tabs>

    </n-gi>
  </n-grid>
</template>
<script setup>
import { ref } from "vue"
import { get, post } from "../utils/request";
import store from '../utils/stores/store.js'

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
  name: "",
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
  name: "",
  description: "",
  proxy_id: "",
  game_id: "",
  node_id: "",
  client_download_url: "",
  client_download_type: "",
  client_download_password: ""
})

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
    console.log(gameListSelect);
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

function handleUpdateValue(value) {
  getLobbys(value)
}
getGameList();
</script>
