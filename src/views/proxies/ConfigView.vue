<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-bookmark-tabs"></i>
    <n-text type="primary"> 配置文件 </n-text>
  </n-h1>
  <n-grid cols="1" y-gap="1" item-responsive>
    <n-grid-item span="1">
      <n-card title="节点">
        <n-select v-model:value="node" :options="serverList" @update:value="updateValue" />
        <n-button
          strong
          secondary
          type="info"
          style="margin-top: 30px"
          v-clipboard="() => code"
          v-clipboard:success="() => sendSuccessMessage('复制成功')"
          v-clipboard:error="() => sendErrorMessage('复制失败')"
        >
          复制
        </n-button>
        <n-code
          :code="code"
          language="ini"
          show-line-numbers
          style="overflow: auto; margin-top: 30px; width: 100%"
        ></n-code>
      </n-card>
      <br />
    </n-grid-item>

    <n-grid-item span="1">
      <n-card title="建站必看">
        <p>由于我们在新的配置文件生成机制中加入了：</p>
        <n-code code="proxy_protocol_version = v2" language="ini"></n-code>
        <p>导致网站如果不正确配置 Nginx 就无法正常访问（不需要请删去）</p>
        <n-divider />
        <p>请根据下面的教程正确配置：</p>
        <p></p>
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
import { sendSuccessMessage, sendErrorMessage } from '@/utils/message'
// import clipboard from '@/utils/clipboard'
import api from '@/api'
import logger from '@/utils/logger'

const node = ref('')
// 选择框数据
const serverList = ref([])
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
    rs = await api.v2.node.all()
  } catch (e) {
    logger.error(e)
    sendErrorMessage('请求节点列表失败: ' + e)
  }
  if (!rs) return
  var i = 0
  rs.data.list.forEach((s) => {
    if (i === 0) {
      node.value = s.id
      updateValue(s.id)
    }
    serverList.value[i] = {
      label: s.name,
      value: s.id
    }
    i = i + 1
  })
})

async function updateValue(value) {
  let rs
  try {
    rs = await api.v2.proxy.config(userData.getters.get_username, null, value)
  } catch (e) {
    logger.error(e)
    sendErrorMessage('请求获取隧道配置文件失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    sendSuccessMessage(rs.message)
    code.value = rs.data.config
  } else {
    sendErrorMessage(rs.message)
    code.value = '该节点下没有任何隧道捏~'
  }
}
</script>
