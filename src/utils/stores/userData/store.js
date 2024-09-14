import vuex from 'vuex'
import defStateData from './def'

const stateData = {
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
    get_email(state) {
      return state.email
    },
    get_frp_token(state) {
      return state.frptoken
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
    // frp token
    set_frp_token(state, frptoken) {
      state.frptoken = frptoken
      localStorage.setItem('frptoken', frptoken)
    },
    remove_frp_token(state) {
      state.frptoken = defStateData.frptoken
      localStorage.removeItem('frptoken')
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
      state.outbound = stateData.outbound
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
    set_user_info(state, userdata) {
      // console.log(userdata)
      state.username = userdata.username
      state.email = userdata.email
      state.frptoken = userdata.frp_token
      state.inbound = userdata.inbound
      state.outbound = userdata.outbound
      state.avatar = userdata.avatar
      state.traffic = userdata.traffic
      // state.proxies_num = userdata.proxies_num
      localStorage.setItem('username', userdata.username)
      localStorage.setItem('email', userdata.email)
      localStorage.setItem('traffic', userdata.traffic)
      localStorage.setItem('frptoken', userdata.frp_token)
      localStorage.setItem('inbound', userdata.inbound)
      localStorage.setItem('outbound', userdata.outbound)
      localStorage.setItem('avatar', userdata.avatar)
      // localStorage.setItem('proxies_num', userdata.proxies_num)
    },
    delete_user_info(state) {
      state.token = defStateData.token
      state.usermame = defStateData.username
      state.email = defStateData.email
      state.frptoken = defStateData.frptoken
      state.inbound = defStateData.inbound
      state.outbound = defStateData.outbound
      state.avatar = defStateData.avatar
      state.traffic = defStateData.traffic
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('email')
      localStorage.removeItem('avatar')
      localStorage.removeItem('traffic')
      localStorage.removeItem('frptoken')
      localStorage.removeItem('inbound')
      localStorage.removeItem('outbound')
      localStorage.removeItem('proxies')
      localStorage.removeItem('avator')
    }
  },

  actions: {
    //    removeToken: (context) => {
    //      context.commit('setToken')
    //    }
  }
})
