import { createRouter, createWebHistory } from "vue-router"
import { StartLoadingBar, FinishLoadingBar, ErrorLoadingBar } from "../utils/loadingbar.js";
import store from "../utils/store"
import { ref } from "vue";

const routes = [
    {
        path: '/',
        children: [
            {
                path: '/',
                name: 'MainPage',
                component: () => import('../views/Personal.vue'),
                meta: {
                    title: '仪表盘'
                }
            },
            {
                path: '/user',
                name: 'User',
                component: () => import('../views/Personal.vue'),
                meta: {
                    title: '仪表盘'
                }
            },
            {
                path: '/sign',
                name: 'Sign',
                component: () => import('../views/Sign.vue'),
                meta: {
                    title: '签到'
                }
            },
            {
                path: '/login',
                name: 'Login',
                component: () => import('../views/login.vue'),
                meta: {
                    title: '登录'
                }
            },
            {
                path: '/register',
                name: 'Register',
                component: () => import('../views/register.vue'),
                meta: {
                    title: '注册'
                }
            },
            {
                path: "/proxies",
                name: 'Proxies',
                component: () => import('../views/proxies.vue'),
                meta: {
                    title: '隧道列表'
                }
            },
            {
                path: '/proxies/addproxies',
                name: "AddProxies",
                component: () => import('../views/addproxies.vue'),
                meta: {
                    title: '添加隧道'
                }
            },
            {
                path: '/realname',
                name: "RealName",
                component: () => import('../views/realname.vue'),
                meta: {
                    title: '实名认证'
                }
            },
            {
                path: '/hello2023',
                name: 'newyear',
                component: () => import('../views/newyear.vue'),
                meta: {
                    title: '新年祝福'
                }
            },
            {
                path: '/prize',
                name: 'prize',
                component: () => import('../views/prize.vue'),
                meta: {
                    title: '抽奖'
                }
            },
            {
                path: '/config',
                name: 'config',
                component: () => import('../views/config.vue'),
                meta: {
                    title: '配置文件'
                }
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
    if (to.name === 'Login'){
        if (store.getters.GetToken){
            next({name: 'User' });
        }
        next();
    };
    if (to.name === 'Register'){
        if (store.getters.GetToken){
            next({name: 'User' });
        }
        next();
    };
    if (!store.getters.GetToken){
        console.log('未检测到登录TOKEN, 转向登录页！');
        next({name: 'Login' });
    } else {
        next();
    };
    if (to.meta.title) {    //设置标题
        var title = to.meta.title + " | LoCyanFrp"
        document.title = title
      }
});

router.afterEach((to, from, next) => {
    FinishLoadingBar();
});

export default router