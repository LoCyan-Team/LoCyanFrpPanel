import { createRouter, createWebHistory } from "vue-router"
import { StartLoadingBar, FinishLoadingBar, ErrorLoadingBar } from "../utils/loadingbar.js";
import store from "../utils/store"
import { ref } from "vue";
import MainSideBar from "../components/MainSideBar.vue";

const routes = [
    {
        path: '/',
        children: [
            {
                path: '/',
                name: 'MainPage',
                meta: {
                    title: '仪表盘'
                },
                component: () => import('../views/Personal.vue')
            },
            {
                path: '/user',
                name: 'User',
                meta: {
                    title: '仪表盘'
                },
                component: () => import('../views/Personal.vue')
            },
            {
                path: '/sign',
                name: 'Sign',
                meta: {
                    title: '签到'
                },
                component: () => import('../views/Sign.vue')
            },
            {
                path: '/login',
                name: 'login',
                meta: {
                    title: '登录'
                },
                component: () => import('../views/login.vue')
            },
            {
                path: '/register',
                name: 'register',
                meta: {
                    title: '注册'
                },
                component: () => import('../views/register.vue')
            },
            {
                path: "/proxies",
                name: 'Proxies',
                meta: {
                    title: '隧道列表'
                },
                component: () => import('../views/proxies.vue')
            },
            {
                path: '/proxies/addproxies',
                name: "AddProxies",
                meta: {
                    title: '添加隧道'
                },
                component: () => import('../views/addproxies.vue')
            },
            {
                path: '/realname',
                name: "RealName",
                meta: {
                    title: '实名认证'
                },
                component: () => import('../views/realname.vue')
            },
            {
                path: '/hello2023',
                name: 'newyear',
                meta: {
                    title: '留言'
                },
                component: () => import('../views/newyear.vue')
            },
            {
                path: '/prize',
                name: 'prize',
                meta: {
                    title: '抽奖'
                },
                component: () => import('../views/prize.vue')
            },
            {
                path: '/config',
                name: 'config',
                meta: {
                    title: '配置文件'
                },
                component: () => import('../views/config.vue')
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
    if (!store.getters.GetToken){
        console.log('未检测到登录TOKEN, 转向登录页！');
        next({name: 'login', query:{"redirect": location.pathname}});
    } else {
        next();
    }
});

router.afterEach((to, from, next) => {
    FinishLoadingBar();
    if (to.meta.title) {    //设置标题
        document.title = to.meta.title + " | LoCyanFrp"
    }
    if (store.getters.GetToken) {
        window.SetSideBarActiveKey(to.name);
    } else {
        window.SetSideBarActiveKey_Guest(to.name);
    }
});

export default router