import userData from './userData'

const defStateData = {
  token: '',
  username: '',
  email: '',
  frptoken: '',
  inbound: 0,
  outbound: 0,
  avatar: '',
  traffic: '',
  proxies_num: 0
}

const loadFromLocal = () => {
  userData.commit('set_token', localStorage.getItem('token') ?? defStateData.token)
  userData.commit('set_username', localStorage.getItem('username') ?? defStateData.username)
  userData.commit('set_user_email', localStorage.getItem('email') ?? defStateData.email)
  userData.commit('set_frp_token', localStorage.getItem('frptoken') ?? defStateData.frptoken)
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
