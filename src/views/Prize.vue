<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-ballot-box-with-ballot"></i>
    <n-text type="primary"> 抽奖</n-text>
  </n-h1>
  <n-grid cols="3" item-responsive>
    <n-grid-item v-for="item in PrizesList" id="item" span="0:3 950:1">
      <n-space style="display: block">
        <n-card :title="'奖品： ' + item.prizename">
          <n-p>
            获奖人:
            <n-tag
              style="margin: 3px"
              type="success"
              v-if="PrizeUsers.length"
              v-for="prizeuser in PrizeUsers[item.id]"
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
          <n-p>创建时间：{{ timestampToTime(item.createtime) }}</n-p>
          <template #footer>
            <n-space justify="space-between">
              开奖时间：{{ timestampToTime(item.prizetime) }}
              <n-button @click="submitjoin(item.id)" v-show="item.id"> 参与 </n-button>
            </n-space>
          </template>
        </n-card>
      </n-space>
    </n-grid-item>
  </n-grid>
</template>

<script setup>
import { ref } from 'vue'
import { SendSuccessDialog, SendWarningDialog } from '../utils/dialog'
import { FinishLoadingBar, StartLoadingBar } from '../utils/loadingbar'
import { get } from '../utils/request.js'
import store from '../utils/stores/store.js'
import { marked } from 'marked'

const PrizesList = ref([
  {
    id: 0,
    username: '',
    prizename: '',
    createtime: '',
    prizetime: '',
    prize_user: '',
    description: ''
  }
])
const formRef = ref(null)
const users = ref([])
const PrizeUsers = ref([])

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

function submitjoin(id) {
  StartLoadingBar()
  const rs = get(
    'https://api.locyanfrp.cn/Prize/JoinPrize?username=' + store.getters.get_username + '&id=' + id
  )
  rs.then((res) => {
    if (res.status) {
      FinishLoadingBar()
      SendSuccessDialog(res.message)
      const rs = get('https://api.locyanfrp.cn/Prize/GetPrizes')
      rs.then((res) => {
        PrizesList.value = res
      })
    } else {
      FinishLoadingBar()
      SendWarningDialog(res.message)
    }
  })
}

function GetPrizeList() {
  let i = 0
  const rs = get('https://api.locyanfrp.cn/Prize/GetPrizes', [])
  rs.then((res) => {
    // 用于展示用户
    // 用奖品ID排列
    res.forEach((e) => {
      PrizesList.value[i] = e
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
          PrizeUsers.value[e.id] = e.prize_user.split('|')
        } else {
          PrizeUsers.value[e.id] = [e.prize_user]
        }
      }

      i++
    })
  })
}

GetPrizeList()
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
