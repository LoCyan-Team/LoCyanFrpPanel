import Vuex from 'vuex'

// 用Vuex.Store对象用来记录token
const store = new Vuex.Store({
    state: {
        token: "",
        username: "",
        email: "",
        frptoken: "",
        inbound: 0,
        outbound: 0,
        avatar: "",
        traffic: ""
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
        },
        GetAvatar(state) {
            return state.avatar || localStorage.getItem("avatar") + "&size=512" || "";
        },
        GetTraffic(state) {
            return Number(state.traffic) / 1024  || Number(localStorage.getItem("traffic")) / 1024 || 0;
        }
    },
    mutations: {
        // 修改token，并将token存入localStorage
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
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
            state.avatar = userdata.avatar;
            state.traffic = userdata.traffic;
            localStorage.setItem('username', userdata.username);
            localStorage.setItem('email', userdata.email);
            localStorage.setItem('traffic', userdata.traffic);
            localStorage.setItem('frptoken', userdata.frptoken);
            localStorage.setItem("inbound", userdata.inbound);
            localStorage.setItem('outbound', userdata.outbound);
            localStorage.setItem('avatar', userdata.avatar);
        },
        setLimit(state, limit_info){
            state.inbound = limit_info.inbound;
            state.outbound = limit_info.outbound;
            localStorage.setItem("inbound", limit_info.inbound);
            localStorage.setItem('outbound', limit_info.outbound);
        },
        delUserInfo(state) {
            state.usermame = "";
            state.email = "";
            state.frptoken = "";
            state.inbound = 0;
            state.outbound = 0;
            state.avatar = "";
            state.traffic = "";
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            localStorage.removeItem("traffic");
            localStorage.removeItem("frptoken");
            localStorage.removeItem("inbound");
            localStorage.removeItem("outbound");
            localStorage.removeItem("proxies")
            localStorage.removeItem("avator")
        }
    },

    actions: {
        //    removeToken: (context) => {
        //      context.commit('setToken')
        //    }
    },
});

export default store;