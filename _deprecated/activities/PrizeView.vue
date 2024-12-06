<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-ballot-box-with-ballot"></i>
    <n-text type="primary"> 抽奖</n-text>
  </n-h1>
  <n-grid cols="3" item-responsive>
    <n-grid-item v-for="item in prizesList" id="item" span="0:3 950:1">
      <n-space style="display: block">
        <n-card :title="'奖品： ' + item.name">
          <n-p>
            获奖人:
            <n-tag
              style="margin: 3px"
              type="success"
              v-if="prizeUsers.length"
              v-for="prizeuser in prizeUsers[item.id]"
              >{{ prizeuser }}
            </n-tag>
            <n-tag style="margin: 3px" type="info" v-else> 暂未开奖 </n-tag>
          </n-p>
          <n-p>
            参与用户:
            <n-tag
              style="margin: 3px"
              type="info"
              v-if="users.length"
              v-for="user in users[item.id]"
              >{{ user }}
            </n-tag>
            <n-tag style="margin: 3px" type="info" v-else> 没有用户参与欸 </n-tag>
          </n-p>
          <n-p>奖品描述：</n-p>
          <n-text v-html="marked(item.description)"></n-text>
          <n-p>创建时间：{{ timestampToTime(item.createTime) }}</n-p>
          <template #footer>
            <n-space justify="space-between">
              开奖时间：{{ timestampToTime(item.prizeTime) }}
              <n-button @click="submitJoin(item.id)" v-show="item.id"> 参与 </n-button>
            </n-space>
          </template>
        </n-card>
      </n-space>
    </n-grid-item>
  </n-grid>
</template>

<script setup>
import { ref } from 'vue'
import { sendSuccessDialog, sendWarningDialog } from '@/utils/dialog.js'
import { finishLoadingBar, startLoadingBar } from '@/utils/loadingbar.js'
import { get } from '@/utils/request.js'
import userData from '@/utils/stores/userData/store.js'
import { marked } from 'marked'

const prizesList = ref([
  {
    id: 0,
    username: '',
    name: '',
    createTime: '',
    prizeTime: '',
    prize_user: '',
    description: ''
  }
])
const formRef = ref(null)
const users = ref([])
const prizeUsers = ref([])

// 时间戳转换
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

function submitJoin(id) {
  startLoadingBar()
  const rs = get(
    'https://api.locyanfrp.cn/Prize/JoinPrize?username=' +
      userData.getters.get_username +
      '&id=' +
      id
  )
  rs.then((res) => {
    if (res.status) {
      finishLoadingBar()
      sendSuccessDialog(res.message)
      const rs = get('https://api.locyanfrp.cn/Prize/GetPrizes')
      rs.then((res) => {
        prizesList.value = res
      })
    } else {
      finishLoadingBar()
      sendWarningDialog(res.message)
    }
  })
}

function getPrizeList() {
  let i = 0
  const rs = get('https://api.locyanfrp.cn/Prize/GetPrizes', [])
  rs.then((res) => {
    // 用于展示用户
    // 用奖品ID排列
    res.forEach((e) => {
      prizesList.value[i] = e
      if (e.username != '') {
        if (e.username.indexOf('|') !== -1) {
          users.value[e.id] = e.username.split('|')
        } else {
          users.value[e.id] = [e.username]
        }
      }

      // 获奖用户部分
      if (e.prize_user != '') {
        if (e.prize_user.indexOf('|') !== -1) {
          prizeUsers.value[e.id] = e.prize_user.split('|')
        } else {
          prizeUsers.value[e.id] = [e.prize_user]
        }
      }

      i++
    })
  })
}

getPrizeList()
</script>
<style scoped>
#item {
  max-width: 100vw;
  margin: 20px;
}

@media (max-width: 1300px) {
  #item {
    margin: 10px;
  }
}
</style>
