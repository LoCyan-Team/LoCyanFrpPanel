import {createRouter, createWebHistory} from "vue-router";
import {FinishLoadingBar, StartLoadingBar} from "../utils/loadingbar.js";
import store from "../utils/stores/store.js";
import {ChangeShowSideBar_Main} from "../components/MainNav.vue";
import {ChangeShowSideBar_Guest} from "../components/GuestNav.vue";
import {SetSideBarActiveKey} from "../components/MainSideBar.vue";
import {SetSideBarActiveKey_Guest} from "../components/GuestSideBar.vue";

const routes = [
    {
        path: "/",
        children: [
            {
                path: "/",
                name: "MainPage",
                meta: {
                    keepAlive: true,
                    title: "首页",
                },
                component: () => import("../views/Main.vue"),
            },
            {
                path: "/dashboard",
                name: "DashBoard",
                meta: {
                    keepAlive: true,
                    title: "仪表盘",
                },
                component: () => import("../views/DashBoard.vue"),
            },
            {
                path: "/sign",
                name: "Sign",
                meta: {
                    keepAlive: true,
                    title: "签到",
                },
                component: () => import("../views/Sign.vue"),
            },
            {
                path: "/login",
                name: "Login",
                meta: {
                    keepAlive: true,
                    title: "登录",
                },
                component: () => import("../views/Login.vue"),
            },
            {
                path: "/register",
                name: "Register",
                meta: {
                    keepAlive: true,
                    title: "注册",
                },
                component: () => import("../views/Register.vue"),
            },
            {
                path: "/reset_password",
                name: "ResetPassword",
                meta: {
                    keepAlive: true,
                    title: "重置密码",
                },
                component: () => import("../views/ResetPassword.vue"),
            },
            {
                path: "/proxies",
                name: "Proxies",
                meta: {
                    keepAlive: true,
                    title: "隧道列表",
                },
                component: () => import("../views/Proxies.vue"),
            },
            {
                path: "/proxies/addproxies",
                name: "AddProxies",
                meta: {
                    keepAlive: true,
                    title: "添加隧道",
                },
                component: () => import("../views/AddProxies.vue"),
            },
            {
                path: "/realname",
                name: "RealName",
                meta: {
                    keepAlive: true,
                    title: "实名认证",
                },
                component: () => import("../views/RealName.vue"),
            },
            {
                path: "/hello2023",
                name: "NewYear",
                meta: {
                    keepAlive: true,
                    title: "留言",
                },
                component: () => import("../views/NewYear.vue"),
            },
            {
                path: "/prize",
                name: "Prize",
                meta: {
                    keepAlive: true,
                    title: "抽奖",
                },
                component: () => import("../views/Prize.vue"),
            },
            {
                path: "/config",
                name: "Config",
                meta: {
                    keepAlive: true,
                    title: "配置文件",
                },
                component: () => import("../views/Config.vue"),
            },
            {
                path: "/xmnetwork/bore",
                name: "XMNWC-Bore",
                meta: {
                    keepAlive: true,
                    title: "Bore 穿透",
                },
                component: () => import("../views/XMNWCBore.vue"),
            },
            {
                path: "/donate",
                name: "Donate",
                meta: {
                    keepAlive: true,
                    title: "赞助",
                },
                component: () => import("../views/Donate.vue"),
            },
            {
                path: "/icp",
                name: "Icp",
                meta: {
                    keepAlive: true,
                    title: "域名白名单",
                },
                component: () => import("../views/IcpCheck.vue"),
            },
            {
                path: "/status",
                name: "Status",
                meta: {
                    keepAlive: true,
                    title: "节点状态",
                },
                component: () => import("../views/Status.vue"),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 检查本地存储是否存在token，若存在则直接使用
if (localStorage.getItem("token")) {
    store.commit("set_token", localStorage.getItem("token"));
}

router.beforeEach((to, from, next) => {
    StartLoadingBar();
    if (to.name === "Login") {
        if (store.getters.get_token) {
            next({name: "DashBoard"});
        }
        next();
        return;
    }
    if (to.name === "Register") {
        if (store.getters.get_token) {
            next({name: "DashBoard"});
        }
        next();
        return;
    }
    if (to.name === "ResetPassword") {
        if (store.getters.get_token) {
            next({name: "DashBoard"});
        }
        next();
        return;
    }
    if (to.name === "MainPage") {
        next();
        return;
    }
    if (!store.getters.get_token) {
        next({name: "Login", query: {redirect: location.pathname}});
    } else {
        next();
    }
});

// from next
router.afterEach((to) => {
    FinishLoadingBar();
    if (to.meta.title) {
        //设置标题
        document.title = to.meta.title + " | LoCyanFrp";
    }

    switch (to.name) {
        case "MainPage":
            ChangeShowSideBar_Main(false);
            ChangeShowSideBar_Guest(false);
            break;
        case "Login":
            ChangeShowSideBar_Main(false);
            ChangeShowSideBar_Guest(true);
            break;
        case "Register":
            ChangeShowSideBar_Main(false);
            ChangeShowSideBar_Guest(true);
            break;
        case "ResetPassword":
            ChangeShowSideBar_Main(false);
            ChangeShowSideBar_Guest(true);
            break;
        default:
            ChangeShowSideBar_Main(true);
            ChangeShowSideBar_Guest(false);
    }

    if (store.getters.get_token) {
        SetSideBarActiveKey(to.name);
    } else {
        SetSideBarActiveKey_Guest(to.name);
    }
});

export default router;
