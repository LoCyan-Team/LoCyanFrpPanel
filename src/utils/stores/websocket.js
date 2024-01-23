import Vuex from 'vuex'

// 用Vuex.Store对象用来记录token
const websocket = new Vuex.Store({
  state: {
    ws_token: ''
  },
  getters: {
    GetConnection(state) {
      return state.ws_token || localStorage.getItem('ws_token') || ''
    }
  },
  mutations: {
    // 修改token，并将token存入localStorage
    set_ws_token(state, token) {
      state.ws_token = token
      localStorage.setItem('ws_token', token)
    },
    del_ws_token(state) {
      state.ws_token = ''
      localStorage.removeItem('ws_token')
    }
  }
})

export default websocket
