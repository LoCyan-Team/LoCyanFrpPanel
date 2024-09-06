<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-red-paper-lantern"></i>
    <n-text type="primary"> 新年祝福</n-text>
  </n-h1>
  <n-form :ref="formRef" :model="NewYear" label-width="auto" size="large">
    <n-grid cols="1" item-responsive>
      <n-grid-item span="1">
        <n-form-item label="评论和祝福" path="comment">
          <n-input
            v-model:value="NewYear.comment"
            placeholder="您有什么想对 LoCyanFrp 全体用户说的吗"
          />
        </n-form-item>
      </n-grid-item>
      <n-gi span="1">
        <n-space justify="end"
          ><n-button type="primary" @click="submitcomment()"> 提交</n-button></n-space
        >
      </n-gi>
    </n-grid>
  </n-form>
  <n-grid cols="3" item-responsive>
    <n-grid-item v-for="item in CommentList" id="item" span="0:3 950:1">
      <n-space style="display: block">
        <n-card :title="'ID: ' + item.id + ' - ' + item.username">
          {{ item.comment }}
          <template #footer> 提交时间：{{ timestampToTime(item.time) }} </template>
        </n-card>
      </n-space>
    </n-grid-item>
  </n-grid>
</template>

<script setup>
import { ref } from 'vue'
import { SendErrorDialog, SendSuccessDialog, SendWarningDialog } from '@/utils/dialog'
import { FinishLoadingBar, StartLoadingBar } from '@/utils/loadingbar'
import { get } from '@/utils/request'
import store from '@/utils/stores/store'

const CommentList = ref([])
const formRef = ref(null)
const NewYear = ref({
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

function submitcomment() {
  StartLoadingBar()
  if (NewYear.value.comment === '') {
    SendErrorDialog('内容不可为空！')
    FinishLoadingBar()
    return
  }
  const rs = get(
    'https://api.locyanfrp.cn/App/SubmitComment?username=' +
      store.getters.get_username +
      '&comment=' +
      NewYear.value.comment,
    []
  )
  rs.then((res) => {
    if (res.status) {
      FinishLoadingBar()
      SendSuccessDialog(res.message)
      getMessageList()
    } else {
      FinishLoadingBar()
      SendWarningDialog(res.message)
    }
  })
}

function getMessageList() {
  const rs = get('https://api.locyanfrp.cn/App/GetComments', [])
  rs.then((res) => {
    CommentList.value = res
  })
}

getMessageList()
</script>
<style scoped>
#item {
  max-width: 100vw;
  margin: 20px;
}
</style>
