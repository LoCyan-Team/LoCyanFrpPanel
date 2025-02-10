!
<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-spiral-calendar"></i>
    <n-text type="primary"> 抽奖</n-text>
  </n-h1>
  <n-space vertical>
    <n-spin :show="loading">
      <n-empty v-if="prizeList.length == 0"></n-empty>
      <n-grid v-else :x-gap="12" :y-gap="12" :cols="4" item-responsive>
        <n-gi span="0:4 1000:1" v-for="item in prizeList" v-bind:key="item.id">
          <n-space style="display: block">
            <n-card :title="'奖品： ' + item.prizeName">
              <n-p>
                获奖人:
                <n-tag
                  style="margin: 3px"
                  type="success"
                  v-for="prizeuser in prizeUsers[item.id]"
                  v-bind:key="prizeuser"
                >
                  {{ prizeuser }}
                </n-tag>
              </n-p>
              <n-p>
                参与用户（共 {{ users[item.id].length }} 位）
                <n-virtual-list style="max-height: 200px" :item-size="38" :items="users[item.id]">
                  <template #default="{ item }">
                    <n-tag :key="item" type="info" style="margin-block:2px; width: 100%; height: 34px">
                      {{ item }}
                    </n-tag>
                  </template>
                </n-virtual-list>
              </n-p>
              <n-p>奖品描述：</n-p>
              <n-text class="markdown-body" v-html="marked(item.description)"></n-text>
              <n-p>创建时间：{{ timestampToTime(item.createTime) }}</n-p>
              <template #footer>
                <n-space justify="space-between">
                  开奖时间：{{ timestampToTime(item.prizeTime) }}
                  <n-button @click="submitJoin(item.id)" v-show="item.id"> 参与 </n-button>
                </n-space>
              </template>
            </n-card>
          </n-space>
        </n-gi>
      </n-grid>
    </n-spin>
  </n-space>
</template>
<script setup>
import api from '@/api'
import Message from '@/utils/message'
import userData from '@/utils/stores/userData/store'
import logger from '@/utils/logger'
import { ref } from 'vue'
import { marked } from 'marked'

const loading = ref(true)

const message = new Message()
//   {
//     id: 0,
//     username: '',
//     prizeName: '',
//     createTime: '',
//     prizeTime: '',
//     prizeUser: '',
//     description: ''
//   }
const prizeList = ref([])
const prizeUsers = ref([])
const users = ref([])

function timestampToTime(timestamp) {
  const date = new Date(timestamp * 1000)
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  const h = date.getHours() + ':'
  const m = date.getMinutes() + ':'
  const s = date.getSeconds()
  return Y + M + D + h + m + s
}

async function getPrizeList() {
  let rs
  try {
    rs = await api.v2.prize.root.get(userData.getters.get_user_id)
  } catch (e) {
    logger.error(e)
    message.error('接口请求失败：' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    prizeList.value = rs.data.list
    rs.data.list.forEach((e) => {
      // 参与抽奖的
      if (e.username != '' && e.username != null) {
        if (e.username.indexOf('|') !== -1) {
          users.value[e.id] = e.username.split('|')
        } else {
          users.value[e.id] = [e.username]
        }
      } else {
        users.value[e.id] = ['暂时没人参与']
      }

      // 获奖用户部分
      if (e.prizeUser != '' && e.prizeUser != null) {
        if (e.prizeUser.indexOf('|') !== -1) {
          prizeUsers.value[e.id] = e.prizeUser.split('|')
        } else {
          prizeUsers.value[e.id] = [e.prizeUser]
        }
      } else {
        prizeUsers.value[e.id] = ['暂未开奖']
      }
    })
    loading.value = false
  } else {
    message.error(rs.message)
  }
}

async function submitJoin(prize_id) {
  let rs
  try {
    rs = await api.v2.prize.root.join(userData.getters.get_user_id, prize_id)
  } catch (e) {
    logger.error(e)
    message.error('接口请求失败：' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    message.success('参与成功')
    getPrizeList()
  } else {
    message.error(rs.message)
  }
}
getPrizeList()
</script>
