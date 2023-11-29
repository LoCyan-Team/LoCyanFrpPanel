import vuex from 'vuex'

// 用Vuex.Store对象用来记录token
const store = new vuex.Store({
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
        get_token(state) {
            return state.token || localStorage.getItem("token") || "";
        },
        get_username(state) {
            return state.username || localStorage.getItem("username") || "";
        },
        get_email(state) {
            return state.email || localStorage.getItem("email") || "";
        },
        get_frp_token(state) {
            return state.frptoken || localStorage.getItem("frptoken") || "";
        },
        get_in_bound(state) {
            // 限速方面必须返回整数
            return state.inbound / 128 || Number(localStorage.getItem("inbound")) / 128 || 0;
        },
        get_out_bound(state) {
            return state.outbound / 128 || Number(localStorage.getItem("outbound")) / 128 || 0;
        },
        get_avatar(state) {
            return state.avatar || localStorage.getItem("avatar") + "&size=512" || "";
        },
        get_traffic(state) {
            return Number(state.traffic) / 1024 || Number(localStorage.getItem("traffic")) / 1024 || 0;
        }
    },
    mutations: {
        // 修改token，并将token存入localStorage
        set_token(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        delete_token(state) {
            state.token = "";
            localStorage.removeItem("token");
        },
        // 可选
        set_user_info(state, userdata) {
            state.username = userdata.username;
            state.email = userdata.email;
            state.frptoken = userdata.frp_token;
            state.inbound = userdata.inbound;
            state.outbound = userdata.outbound;
            state.avatar = userdata.avatar;
            state.traffic = userdata.traffic;
            localStorage.setItem('username', userdata.username);
            localStorage.setItem('email', userdata.email);
            localStorage.setItem('traffic', userdata.traffic);
            localStorage.setItem('frptoken', userdata.frp_token);
            localStorage.setItem("inbound", userdata.inbound);
            localStorage.setItem('outbound', userdata.outbound);
            localStorage.setItem('avatar', userdata.avatar);
        },
        set_limit(state, limit_info) {
            state.inbound = limit_info.inbound;
            state.outbound = limit_info.outbound;
            localStorage.setItem("inbound", limit_info.inbound);
            localStorage.setItem('outbound', limit_info.outbound);
        },
        delete_user_info(state) {
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