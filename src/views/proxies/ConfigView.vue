<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-bookmark-tabs"></i>
    <n-text type="success"> 配置文件</n-text>
  </n-h1>
  <n-grid cols="1" y-gap="1" item-responsive>
    <n-grid-item span="1">
      <n-card title="隧道配置">
        <n-spin :show="loading">
          <n-tabs type="line" size="large" :tabs-padding="20" @update:value="tabUpdateHandler">
            <n-tab-pane name="node" tab="按节点">
              <n-select
                v-model:value="node"
                :options="serverList"
                @update:value="updateValue(node, null)"
              />
            </n-tab-pane>
            <n-tab-pane name="proxy" tab="按隧道">
              <n-select
                v-model:value="proxy"
                :options="proxyList"
                @update:value="updateValue(null, proxy)"
              />
            </n-tab-pane>
          </n-tabs>
          <n-scrollbar x-scrollable>
            <n-code
              :code="code"
              language="ini"
              show-line-numbers
              style="margin-top: 30px; width: 100%"
            />
          </n-scrollbar>
        </n-spin>
        <n-button
          strong
          secondary
          type="info"
          style="margin-top: 30px"
          v-clipboard="() => code"
          v-clipboard:success="() => message.success('复制成功')"
          v-clipboard:error="() => message.error('复制失败')"
        >
          复制
        </n-button>
      </n-card>
      <br />
    </n-grid-item>

    <n-grid-item span="1">
      <n-card title="获取用户真实 IP">
        <p>您可以通过 HAProxy Protocol 来获取用户真实 IP</p>
        <p>在配置文件中加入：</p>
        <n-scrollbar x-scrollable>
          <n-code code="proxy_protocol_version = v2" language="ini"></n-code>
        </n-scrollbar>
        <p>打开后端的 HAProxy Protocol 支持即可</p>
        <n-divider />
        <n-h4>网站配置示例</n-h4>
        <p>
          1. 打开网站的配置文件（针对 Nginx 的网站，其他形式的网站请自行百度），在
          <n-code code="listen 80" language="nginx" word-wrap></n-code> 与
          <n-code code="listen 443 ssl http2" language="nginx" word-wrap></n-code> 两行的最后加上
          <n-code code="proxy_protocol" language="nginx" word-wrap></n-code>
        </p>
        <p>2. 在 root 下方放入这三行代码：</p>
        <n-code
          code="real_ip_header proxy_protocol;
real_ip_recursive on;
set_real_ip_from 127.0.0.1;"
          language="nginx"
          word-wrap
        ></n-code>
        <p>3. 更改最后一个参数中的 127.0.0.1 请你改为创建隧道时填写的本地 IP（local_ip）。</p>
        <p>4. 保存，重启 Nginx，你就可以获取用户的真实 IP 啦！</p>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script></script>

<script setup>
import { ref } from 'vue'
import userData from '@/utils/stores/userData/store'
import Message from '@/utils/message'
// import clipboard from '@/utils/clipboard'
import api from '@/api'
import logger from '@/utils/logger'

const message = new Message()

const loading = ref(true)

const node = ref(null)
const proxy = ref(null)
// 选择框数据
const serverList = ref([])
const proxyList = ref([])
const code = ref('')

// const rs = get('https://api.locyanfrp.cn/Proxies/GetServerList')
// rs.then((res) => {
//   var i = 0
//   res.forEach((s) => {
//     if (i === 0) {
//       node.value = s.id
//       updateValue(s.id)
//     }
//     ServerList.value[i] = {
//       label: s.name,
//       value: s.id
//     }
//     i = i + 1
//   })
// })

onMounted(async () => {
  let rs
  try {
    rs = await api.v2.node.all(userData.getters.get_user_id)
  } catch (e) {
    logger.error(e)
    message.error('请求节点列表失败: ' + e)
  }
  if (!rs) return
  let i = 0
  const list = rs.data.list
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
    if (i === 0) {
      node.value = s.id
      updateValue(s.id, null)
    }
    serverList.value[i] = {
      label: s.name,
      value: s.id
    }
    i = i + 1
  })
})

onMounted(async () => {
  let rs
  try {
    rs = await api.v2.proxy.all(userData.getters.get_user_id)
  } catch (e) {
    logger.error(e)
    message.error('请求隧道列表失败: ' + e)
  }
  if (!rs) return
  let i = 0
  const list = rs.data.list
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
    if (i === 0) {
      proxy.value = s.id
      updateValue(null, s.id)
    }
    proxyList.value[i] = {
      label: s.proxy_name,
      value: s.id
    }
    i = i + 1
  })
})

async function tabUpdateHandler(value) {
  switch (value) {
    case 'node':
      await updateValue(node.value, null)
      break
    case 'proxy':
      await updateValue(null, proxy.value)
      break
  }
}

async function updateValue(nodeId, proxyId) {
  loading.value = true
  let rs
  try {
    rs = await api.v2.proxy.config(userData.getters.get_user_id, proxyId, nodeId)
  } catch (e) {
    logger.error(e)
    message.error('请求获取隧道配置文件失败: ' + e)
    loading.value = false
  }
  if (!rs) return
  if (rs.status === 200) {
    code.value = rs.data.config
  } else {
    message.error(rs.message)
    code.value = '该节点下没有任何隧道捏~'
  }
  loading.value = false
}
</script>
