import axios from 'axios'
import { ref } from 'vue'
import userData from './stores/userData/store'
import router from '@router'
import { get } from './request'
import { sendWarningMessage } from './message'

export function getNotice() {
  const rs = ref('')
  axios({
    method: 'get',
    url: 'https://api.locyanfrp.cn/App'
  }).then((res) => {
    rs.value = res.data
  })
  return rs
}

export function getLoginStatus(username, token) {
  const rs = get(
    'https://api.locyanfrp.cn/Account/info?username=' + username + '&token=' + token,
    []
  )
  const return_res = ref('')
  rs.then((res) => {
    if (res.status !== 0) {
      sendWarningMessage('登录过期或未登录，请使用 LCF 账户登录后台！')
      logout()
    } else {
      return_res.value = res
      return return_res
    }
  })
  return return_res
}

export function getProxies(username, token) {
  const rs = get(
    'https://api.locyanfrp.cn/Proxies/GetProxiesList?username=' + username + '&token=' + token,
    []
  )
  rs.then((res) => {
    if (res.status !== 0) {
      return res
    } else {
      localStorage.setItem('proxies', res.count)
      return res.proxies
    }
  })
}

export function logout() {
  userData.commit('delete_user_info')
}
