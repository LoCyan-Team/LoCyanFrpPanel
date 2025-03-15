import { createStore } from 'vuex'
import defStateData from './def'

interface State {
  token: string
  username: string
  user_id: number
  email: string
  frp_token: string
  inbound: number
  outbound: number
  avatar: string
  traffic: string
  proxies_num: number
}

const state = {
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

const getters = {
  get_token(state: typeof defStateData) {
    return state.token
  },
  get_username(state: typeof defStateData) {
    return state.username
  },
  get_user_id(state: typeof defStateData) {
    return state.user_id
  },
  get_email(state: typeof defStateData) {
    return state.email
  },
  get_frp_token(state: typeof defStateData) {
    return state.frp_token
  },
  get_user_inbound(state: typeof defStateData) {
    // 限速方面必须返回整数
    return state.inbound / 128
  },
  get_user_outbound(state: typeof defStateData) {
    return state.outbound / 128
  },
  get_avatar(state: typeof defStateData) {
    return state.avatar
  },
  get_traffic(state: typeof defStateData) {
    return Number(state.traffic) / 1024
  },
  get_proxies_num(state: typeof defStateData) {
    return state.proxies_num
  }
}

const mutations = {
  // token
  set_token(state: typeof defStateData, token: string) {
    state.token = token
    localStorage.setItem('token', token)
  },
  remove_token(state: typeof defStateData) {
    state.token = defStateData.token
    localStorage.removeItem('token')
  },
  // username
  set_username(state: typeof defStateData, username: string) {
    state.username = username
    localStorage.setItem('username', username)
  },
  remove_username(state: typeof defStateData) {
    state.username = defStateData.username
    localStorage.removeItem('username')
  },
  // user id
  set_user_id(state: typeof defStateData, user_id: number) {
    state.user_id = user_id
    localStorage.setItem('user_id', user_id)
  },
  remove_user_id(state: typeof defStateData) {
    state.user_id = defStateData.user_id
    localStorage.removeItem('user_id')
  },
  // frp token
  set_frp_token(state: typeof defStateData, frp_token: string) {
    state.frp_token = frp_token
    localStorage.setItem('frp_token', frp_token)
  },
  remove_frp_token(state: typeof defStateData) {
    state.frp_token = defStateData.frp_token
    localStorage.removeItem('frp_token')
  },
  // inbound
  set_user_inbound(state: typeof defStateData, inbound: number) {
    state.inbound = inbound
    localStorage.setItem('inbound', inbound)
  },
  remove_user_inbound(state: typeof defStateData) {
    state.inbound = defStateData.inbound
    localStorage.removeItem('inbound')
  },
  // outbound
  set_user_outbound(state: typeof defStateData, outbound: number) {
    state.outbound = outbound
    localStorage.setItem('outbound', outbound)
  },
  remove_user_outbound(state: typeof defStateData) {
    state.outbound = defStateData.outbound
    localStorage.removeItem('outbound')
  },
  // email
  set_user_email(state: typeof defStateData, email: string) {
    state.email = email
    localStorage.setItem('email', email)
  },
  remove_user_email(state: typeof defStateData) {
    state.email = defStateData.email
    localStorage.removeItem('email')
  },
  // traffic
  set_user_traffic(state: typeof defStateData, traffic: string) {
    state.traffic = traffic
    localStorage.setItem('traffic', traffic)
  },
  remove_user_traffic(state: typeof defStateData) {
    state.traffic = defStateData.traffic
    localStorage.removeItem('traffic')
  },
  // avatar
  set_avatar(state: typeof defStateData, avatar: string) {
    state.avatar = avatar
    localStorage.setItem('avatar', avatar)
  },
  remove_avatar(state: typeof defStateData) {
    state.avatar = defStateData.avatar
    localStorage.removeItem('avatar')
  },
  set_limit(
    state: typeof defStateData,
    limit_info: {
      inbound: number
      outbound: number
    }
  ) {
    state.inbound = limit_info.inbound
    state.outbound = limit_info.outbound
    localStorage.setItem('inbound', limit_info.inbound.toString())
    localStorage.setItem('outbound', limit_info.outbound.toString())
  },
  // 可选
  set_user_info(state: typeof defStateData, userData: any) {
    // console.log(userData)
    state.username = userData.username
    state.user_id = userData.id
    state.email = userData.email
    state.frp_token = userData.frp_token
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
  delete_user_info(state: typeof defStateData) {
    state.token = defStateData.token
    state.username = defStateData.username
    state.user_id = defStateData.user_id
    state.email = defStateData.email
    state.frp_token = defStateData.frp_token
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
}

// 用Vuex.Store对象用来记录token
export default createStore<State>({
  state: state,
  getters: getters,
  mutations: mutations,
  actions: {
    //    removeToken: (context) => {
    //      context.commit('setToken')
    //    }
  }
})
