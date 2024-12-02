import userData from './store'
import defStateData from './def'

const loadFromLocal = () => {
  userData.commit('set_token', localStorage.getItem('token') ?? defStateData.token)
  userData.commit('set_username', localStorage.getItem('username') ?? defStateData.username)
  userData.commit('set_user_id', localStorage.getItem('user_id') ?? defStateData.user_id)
  userData.commit('set_user_email', localStorage.getItem('email') ?? defStateData.email)
  userData.commit('set_frp_token', localStorage.getItem('frp_token') ?? defStateData.frp_token)
  userData.commit(
    'set_user_inbound',
    Number(localStorage.getItem('inbound') ?? defStateData.inbound)
  )
  userData.commit(
    'set_user_outbound',
    Number(localStorage.getItem('outbound') ?? defStateData.outbound)
  )
  userData.commit('set_avatar', localStorage.getItem('avatar') ?? defStateData.avatar)
  userData.commit(
    'set_user_traffic',
    Number(localStorage.getItem('traffic') ?? defStateData.traffic)
  )
  // userData.commit('set_proxies_num', localStorage.getItem('proxies_num'))
}

export default loadFromLocal
