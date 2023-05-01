import { createRouter, createWebHistory } from "vue-router"
import { StartLoadingBar, FinishLoadingBar } from "../utils/loadingbar.js";
import store from "../utils/stores/store.js"
import { ChangeShowSideBar_Main } from "../components/MainNav.vue";
import { ChangeShowSideBar_Guest } from "../components/GuestNav.vue";
import { SetSideBarActiveKey } from "../components/MainSideBar.vue";
import { SetSideBarActiveKey_Guest } from "../components/GuestSideBar.vue";

const routes = [
    {
        path: '/',
        children: [
            {
                path: '/',
                name: 'MainPage',
                meta: {
                    keepAlive: true,
                    title: '首页'
                },
                component: () => import('../views/Main.vue')
            },
            {
                path: '/dashboard',
                name: 'Dashboard',
                meta: {
                    keepAlive: true,
                    title: '仪表盘'
                },
                component: () => import('../views/Dashboard.vue')
            },
            {
                path: '/sign',
                name: 'Sign',
                meta: {
                    keepAlive: true,
                    title: '签到'
                },
                component: () => import('../views/Sign.vue')
            },
            {
                path: '/login',
                name: 'login',
                meta: {
                    keepAlive: true,
                    title: '登录'
                },
                component: () => import('../views/login.vue')
            },
            {
                path: '/register',
                name: 'register',
                meta: {
                    keepAlive: true,
                    title: '注册'
                },
                component: () => import('../views/register.vue')
            },
            {
                path: '/reset_password',
                name: 'reset_password',
                meta: {
                    keepAlive: true,
                    title: '重置密码'
                },
                component: () => import('../views/resetpassword.vue')
            },
            {
                path: "/proxies",
                name: 'Proxies',
                meta: {
                    keepAlive: true,
                    title: '隧道列表'
                },
                component: () => import('../views/proxies.vue')
            },
            {
                path: '/proxies/addproxies',
                name: "AddProxies",
                meta: {
                    keepAlive: true,
                    title: '添加隧道'
                },
                component: () => import('../views/addproxies.vue')
            },
            {
                path: '/realname',
                name: "RealName",
                meta: {
                    keepAlive: true,
                    title: '实名认证'
                },
                component: () => import('../views/realname.vue')
            },
            {
                path: '/hello2023',
                name: 'newyear',
                meta: {
                    keepAlive: true,
                    title: '留言'
                },
                component: () => import('../views/newyear.vue')
            },
            {
                path: '/prize',
                name: 'prize',
                meta: {
                    keepAlive: true,
                    title: '抽奖'
                },
                component: () => import('../views/prize.vue')
            },
            {
                path: '/config',
                name: 'config',
                meta: {
                    keepAlive: true,
                    title: '配置文件'
                },
                component: () => import('../views/config.vue')
            },
            {
                path: '/donate',
                name: 'donate',
                meta: {
                    keepAlive: true,
                    title: '赞助'
                },
                component: () => import('../views/donate.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 检查本地存储是否存在token，若存在则直接使用
if (localStorage.getItem("token")) {
    store.commit("setToken", localStorage.getItem("token"));
}

router.beforeEach((to, from, next) => {
    StartLoadingBar();
    if (to.name === 'login'){
        if (store.getters.GetToken){
            next({name: 'User' });
        }
        next();
        return
    }
    if (to.name === 'register'){
        if (store.getters.GetToken){
            next({name: 'User' });
        }
        next();
        return
    }
    if (to.name === 'reset_password'){
        if (store.getters.GetToken){
            next({name: 'User' });
        }
        next();
        return
    }
    if (to.name === 'MainPage'){
        next();
        return
    }
    if (!store.getters.GetToken){
        next({name: 'login', query:{"redirect": location.pathname}});
    } else {
        next();
    }
});

// from next
router.afterEach((to) => {
    FinishLoadingBar();
    if (to.meta.title) {    //设置标题
        document.title = to.meta.title + " | LoCyanFrp"
    }

    switch (to.name) {
        case "MainPage":
            ChangeShowSideBar_Main(false);
            ChangeShowSideBar_Guest(false);
            break;
        case "login":
            ChangeShowSideBar_Main(false);
            ChangeShowSideBar_Guest(true);
            break;
        case "register":
            ChangeShowSideBar_Main(false);
            ChangeShowSideBar_Guest(true);
            break;
        case "reset_password":
            ChangeShowSideBar_Main(false);
            ChangeShowSideBar_Guest(true);
            break;
        default:
            ChangeShowSideBar_Main(true);
            ChangeShowSideBar_Guest(false);
    }

    if (store.getters.GetToken) {
        SetSideBarActiveKey(to.name);
    } else {
        SetSideBarActiveKey_Guest(to.name);
    }
});

export default router