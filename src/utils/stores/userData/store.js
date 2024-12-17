import vuex from 'vuex'
import defStateData from './def'

const stateData = {
  token: '',
  username: '',
  user_id: 0,
  email: '',
  frp_token: '',
  inbound: 0,
  outbound: 0,
  avatar: '',
  traffic: '',
  proxies_num: 0
}

// 用Vuex.Store对象用来记录token
export default new vuex.Store({
  state: stateData,
  getters: {
    get_token(state) {
      return state.token
    },
    get_username(state) {
      return state.username
    },
    get_user_id(state) {
      return state.user_id
    },
    get_email(state) {
      return state.email
    },
    get_frp_token(state) {
      return state.frp_token
    },
    get_user_inbound(state) {
      // 限速方面必须返回整数
      return state.inbound / 128
    },
    get_user_outbound(state) {
      return state.outbound / 128
    },
    get_avatar(state) {
      return state.avatar
    },
    get_traffic(state) {
      return Number(state.traffic) / 1024
    },
    get_proxies_num(state) {
      return state.proxies_num
    }
  },
  mutations: {
    // token
    set_token(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    remove_token(state) {
      state.token = defStateData.token
      localStorage.removeItem('token')
    },
    // username
    set_username(state, username) {
      state.username = username
      localStorage.setItem('username', username)
    },
    remove_username(state) {
      state.username = defStateData.username
      localStorage.removeItem('username')
    },
    // user id
    set_user_id(state, user_id) {
      console.log(user_id)
      state.user_id = user_id
      localStorage.setItem('user_id', user_id)
    },
    remove_user_id(state) {
      state.user_id = defStateData.user_id
      localStorage.removeItem('user_id')
    },
    // frp token
    set_frp_token(state, frp_token) {
      state.frp_token = frp_token
      localStorage.setItem('frp_token', frp_token)
    },
    remove_frp_token(state) {
      state.frp_token = defStateData.frp_token
      localStorage.removeItem('frp_token')
    },
    // inbound
    set_user_inbound(state, inbound) {
      state.inbound = inbound
      localStorage.setItem('inbound', inbound)
    },
    remove_user_inbound(state) {
      state.inbound = defStateData.inbound
      localStorage.removeItem('inbound')
    },
    // outbound
    set_user_outbound(state, outbound) {
      state.outbound = outbound
      localStorage.setItem('outbound', outbound)
    },
    remove_user_outbound(state) {
      state.outbound = defStateData.outbound
      localStorage.removeItem('outbound')
    },
    // email
    set_user_email(state, email) {
      state.email = email
      localStorage.setItem('email', email)
    },
    remove_user_email(state) {
      state.email = defStateData.email
      localStorage.removeItem('email')
    },
    // traffic
    set_user_traffic(state, traffic) {
      state.traffic = traffic
      localStorage.setItem('traffic', traffic)
    },
    remove_user_traffic(state) {
      state.traffic = defStateData.traffic
      localStorage.removeItem('traffic')
    },
    // avatar
    set_avatar(state, avatar) {
      state.avatar = avatar
      localStorage.setItem('avatar', avatar)
    },
    remove_avatar(state) {
      state.avatar = defStateData.avatar
      localStorage.removeItem('avatar')
    },
    set_limit(state, limit_info) {
      state.inbound = limit_info.inbound
      state.outbound = limit_info.outbound
      localStorage.setItem('inbound', limit_info.inbound)
      localStorage.setItem('outbound', limit_info.outbound)
    },
    // 可选
    set_user_info(state, userData) {
      // console.log(userData)
      state.username = userData.username
      state.user_id = userData.id
      state.email = userData.email
      state.frptoken = userData.frp_token
      state.inbound = userData.inbound
      state.outbound = userData.outbound
      state.avatar = userData.avatar
      state.traffic = userData.traffic
      // state.proxies_num = userdata.proxies_num
      localStorage.setItem('username', userData.username)
      localStorage.setItem('user_id', userData.id)
      localStorage.setItem('email', userData.email)
      localStorage.setItem('traffic', userData.traffic)
      localStorage.setItem('frp_token', userData.frp_token)
      localStorage.setItem('inbound', userData.inbound)
      localStorage.setItem('outbound', userData.outbound)
      localStorage.setItem('avatar', userData.avatar)
      // localStorage.setItem('proxies_num', userdata.proxies_num)
    },
    delete_user_info(state) {
      state.token = defStateData.token
      state.username = defStateData.username
      state.user_id = defStateData.user_id
      state.email = defStateData.email
      state.frptoken = defStateData.frptoken
      state.inbound = defStateData.inbound
      state.outbound = defStateData.outbound
      state.avatar = defStateData.avatar
      state.traffic = defStateData.traffic
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('user_id')
      localStorage.removeItem('email')
      localStorage.removeItem('avatar')
      localStorage.removeItem('traffic')
      localStorage.removeItem('frp_token')
      localStorage.removeItem('inbound')
      localStorage.removeItem('outbound')
      localStorage.removeItem('proxies')
      localStorage.removeItem('avatar')
    }
  },

  actions: {
    //    removeToken: (context) => {
    //      context.commit('setToken')
    //    }
  }
})
