<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-link"></i>
    <n-text type="primary">
      Minecraft 联机
      <n-tag type="warning" class="beta-tag">BETA</n-tag>
    </n-text>
  </n-h1>
  <n-grid y-gap="12" cols="1" item-responsive>
    <n-grid-item span="1">
      <n-card title="创建">
        <n-text>选择隧道</n-text>
        <br />
        <br />
        <n-select v-model:value="selected" :options="options"></n-select>
        <br />
        <n-button
          type="primary"
          @click="createMinecraftGame"
          :loading="createLoading"
          :disabled="createLoading"
        >
          创建
        </n-button>
      </n-card>
    </n-grid-item>
    <n-grid-item span="1">
      <n-h3>已创建的联机</n-h3>
      <n-spin :show="loading">
        <n-empty v-if="created.length === 0" description="没有任何数据捏"></n-empty>
        <n-grid v-else cols="3" item-responsive :x-gap="12" :y-gap="12">
          <n-grid-item v-for="item in created" span="0:3 950:1">
            <n-space style="display: block">
              <n-card>
                <n-space>
                  <n-h4>{{ item.name }}</n-h4>
                </n-space>
                <n-text>隧道 ID: {{ item.proxy_id }}</n-text>
                <br />
                <n-text>联机代码: {{ item.code }}</n-text>
                <br />
                <template #action>
                  <n-space>
                    <n-button
                      style="margin: 1px"
                      type="info"
                      v-clipboard="() => item.code"
                      v-clipboard:success="() => message.success('复制成功')"
                      v-clipboard:error="() => message.error('复制失败')"
                    >
                      复制联机代码
                    </n-button>
                    <n-button
                      style="margin: 1px"
                      type="error"
                      @click="deleteMinecraftGame(item.code)"
                      >删除</n-button
                    >
                  </n-space>
                </template>
              </n-card>
            </n-space>
          </n-grid-item>
        </n-grid>
      </n-spin>
    </n-grid-item>
  </n-grid>
</template>

<script setup>
import api from '@/api'
import Message from '@/utils/message'
import userData from '@/utils/stores/userData/store'
import { ref } from 'vue'

const message = new Message()

const loading = ref(true)
const createLoading = ref(false)

let selected = ref('')
let options = ref([])
let created = ref([])

async function initProxyList() {
  let rs
  try {
    rs = await api.v2.proxy.all(userData.getters.get_user_id)
  } catch (e) {
    message.error('请求隧道列表失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    const proxies = []
    rs.data.list.forEach((value) => {
      if (value.proxy_type === 'tcp') {
        proxies.push(value)
      }
    })
    proxies.forEach((value) => {
      options.value.push({
        label: value.proxy_name,
        value: value.id
      })
    })
    if (proxies.length !== 0) selected.value = proxies[0].id
  } else if (rs.status === 404) {
    // Nothing to do here
  } else {
    message.error(rs.message)
  }
}

async function initCreatedGames() {
  created.value.length = 0
  let rs
  try {
    rs = await api.v2.minecraft.game.all(userData.getters.get_user_id)
  } catch (e) {
    message.error('请求游戏列表失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    rs.data.list.forEach((value) => created.value.push(value))
    loading.value = false
  } else {
    message.error(rs.message)
  }
}

async function createMinecraftGame() {
  createLoading.value = true
  let selectedId = selected.value
  let rs
  try {
    rs = await api.v2.minecraft.game.root.post(userData.getters.get_user_id, selectedId)
  } catch (e) {
    message.error('创建联机失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    loading.value = true
    await initCreatedGames()
    loading.value = false
  } else {
    message.error(rs.message)
  }
  createLoading.value = false
}

async function deleteMinecraftGame(code) {
  let rs
  try {
    rs = await api.v2.minecraft.game.root.delete(userData.getters.get_user_id, code)
  } catch (e) {
    message.error('删除联机失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    created.value = created.value.filter((item) => {
      return item.code !== code
    })
    message.success('删除成功')
  } else {
    message.error(rs.message)
  }
}

initProxyList()
initCreatedGames()
</script>

<style scoped>
.beta-tag {
  transform: translateY(-5px);
}
</style>
