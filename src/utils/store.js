import Vuex from 'vuex'

// 用Vuex.Store对象用来记录token
const store = new Vuex.Store({
    state: {
        // 存储token
        token: "",
        username: "",
        email: "",
        frptoken: "",
        inbound: 0,
        outbound: 0
    },
    getters: {
        GetToken(state) {
            return state.token || localStorage.getItem("token") || "";
        },
        GetUserName(state) {
            return state.username || localStorage.getItem("username") || "";
        },
        GetEmail(state) {
            return state.email || localStorage.getItem("email") || "";
        },
        GetFrpToken(state) {
            return state.frptoken || localStorage.getItem("frptoken") || "";
        },
        GetInBound(state) {
            // 限速方面必须返回整数
            return state.inbound / 128 || Number(localStorage.getItem("inbound")) / 128 || 0;
        },
        GetOutBound(state) {
            return state.outbound / 128 || Number(localStorage.getItem("outbound")) /128 || 0;
        }
    },
    mutations: {
        // 修改token，并将token存入localStorage
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
            console.log('检测到用户token，直接登录!');
        },
        delToken(state) {
            state.token = "";
            localStorage.removeItem("token");
        },
        // 可选
        setUserInfo(state, userdata) {
            state.username = userdata.username;
            state.email = userdata.email;
            state.frptoken = userdata.frptoken;
            state.inbound = userdata.inbound;
            state.outbound = userdata.outbound;
            localStorage.setItem('username', userdata.username);
            localStorage.setItem('email', userdata.email);
            // localStorage.setItem('traffic', userdata.traffic);
            localStorage.setItem('frptoken', userdata.frptoken);
            localStorage.setItem("inbound", userdata.inbound);
            localStorage.setItem('outbound', userdata.outbound);
        },
        delUserInfo(state) {
            state.usermame = "";
            state.email = "";
            state.frptoken = "";
            state.inbound = 0;
            state.outbound = 0;
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            localStorage.removeItem("traffic");
            localStorage.removeItem("frptoken");
            localStorage.removeItem("inbound");
            localStorage.removeItem("outbound");
        }
    },

    actions: {
        //    removeToken: (context) => {
        //      context.commit('setToken')
        //    }
    },
});

export default store;