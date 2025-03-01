<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-red-paper-lantern"></i>
    <n-text type="success"> 新年祝福</n-text>
  </n-h1>
  <n-form :ref="formRef" :model="newYear" label-width="auto" size="large">
    <n-grid cols="1" item-responsive>
      <n-grid-item span="1">
        <n-form-item label="评论和祝福" path="comment">
          <n-input
            v-model:value="newYear.comment"
            placeholder="您有什么想对 LoCyanFrp 全体用户说的吗"
          />
        </n-form-item>
      </n-grid-item>
      <n-gi span="1">
        <n-space justify="end">
          <n-button type="success" @click="submitComment()"> 提交</n-button>
        </n-space>
      </n-gi>
    </n-grid>
  </n-form>
  <n-spin :show="loading">
    <n-empty v-if="commentList.length === 0"></n-empty>
    <n-grid cols="3" item-responsive>
      <n-grid-item v-for="item in commentList" id="item" span="0:3 950:1" v-bind:key="item.id">
        <n-space style="display: block">
          <n-card :title="'ID: ' + item.id + ' - ' + item.username">
            {{ item.comment }}
            <template #footer> 提交时间：{{ timestampToTime(item.time) }} </template>
          </n-card>
        </n-space>
      </n-grid-item>
    </n-grid>
  </n-spin>
</template>

<script setup>
import { ref } from 'vue'
import Message from '@/utils/dialog.js'
import api from '@/api'
import userData from '@/utils/stores/userData/store.js'

const loading = ref(true)

const message = new Message()

const commentList = ref([])
const formRef = ref(null)
const newYear = ref({
  comment: ''
})

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

async function submitComment() {
  let rs
  try {
    rs = await api.v2.comment.post(userData.getters.get_user_id, newYear.value.comment)
  } catch (e) {
    logger.error(e)
    message.error('接口请求失败：' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    message.success('提交成功')
    getMessageList()
  } else {
    message.error(rs.message)
  }
}

async function getMessageList() {
  let rs
  try {
    rs = await api.v2.comment.get(userData.getters.get_user_id)
  } catch (e) {
    logger.error(e)
    message.error('接口请求失败：' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    commentList.value = rs.data.list
    loading.value = false
  } else {
    message.error(rs.message)
  }
}

getMessageList()
</script>
<style scoped>
#item {
  max-width: 100vw;
  margin: 5px;
}
</style>
