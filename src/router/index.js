import { createRouter, createWebHistory } from 'vue-router'
import { finishLoadingBar, startLoadingBar } from '@/utils/loadingbar'
import userData from '@/utils/stores/userData/store'
import { changeMainSideBarShow } from '@/components/MainNav.vue'
import { changeShowGuestSideBar } from '@/components/GuestNav.vue'
import { setSideBarActiveKey } from '@/components/MainSideBar.vue'
import { setGuestSideBarActiveKey } from '@/components/GuestSideBar.vue'
import logger from '@/utils/logger'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '/',
        name: 'MainPage',
        meta: {
          title: '首页'
        },
        component: () => import('@views/MainView.vue')
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        meta: {
          title: '仪表盘',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@views/DashboardView.vue')
      },
      {
        path: '/sign',
        name: 'Sign',
        meta: {
          title: '签到',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@views/SignView.vue')
      },
      {
        path: '/login',
        name: 'Login',
        meta: {
          title: '登录',
          keepAlive: true,
          autoRedirectLogined: true
        },
        component: () => import('@views/auth/LoginView.vue')
      },
      {
        path: '/register',
        name: 'Register',
        meta: {
          title: '注册',
          keepAlive: true,
          autoRedirectLogined: true
        },
        component: () => import('@views/auth/RegisterView.vue')
      },
      {
        path: '/reset_password',
        name: 'ResetPassword',
        meta: {
          title: '重置密码',
          keepAlive: true,
          autoRedirectLogined: true
        },
        component: () => import('@views/auth/ResetPasswordView.vue')
      },
      {
        path: '/proxies',
        name: 'Proxies',
        meta: {
          title: '隧道列表',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@views/proxies/ProxiesView.vue')
      },
      {
        path: '/proxies/add',
        name: 'AddProxies',
        meta: {
          title: '添加隧道',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@views/proxies/AddView.vue')
      },
      {
        path: '/realname',
        name: 'RealName',
        meta: {
          title: '实名认证',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@views/RealNameView.vue')
      },
      {
        path: '/hello2024',
        name: 'NewYear',
        meta: {
          title: '留言',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@views/activities/NewYearView.vue')
      },
      {
        path: '/prize',
        name: 'Prize',
        meta: {
          title: '抽奖',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@views/activities/PrizeView.vue')
      },
      {
        path: '/proxies/config',
        name: 'Config',
        meta: {
          title: '配置文件',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@views/proxies/ConfigView.vue')
      },
      {
        path: '/donate',
        name: 'Donate',
        meta: {
          title: '赞助',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@views/DonateView.vue')
      },
      {
        path: '/icp',
        name: 'Icp',
        meta: {
          title: '域名白名单',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@views/IcpCheckView.vue')
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        meta: {
          title: '页面未找到'
        },
        component: () => import('@views/NotFoundView.vue')
      }
      // 没做完的
      // {
      //   path: '/multiplayer',
      //   name: 'Multiplayer',
      //   meta: {
      //     keepAlive: true,
      //     title: '多人游戏大厅'
      //   },
      //   component: () => import('@views/LanLobby.vue')
      // }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// // 检查本地存储是否存在token，若存在则直接使用
// if (localStorage.getItem('token')) {
//   userData.commit('set_token', localStorage.getItem('token'))
// }

router.beforeEach((to, from, next) => {
  logger.info(`Routing from ${from.name} to ${to.name}`)
  startLoadingBar()

  if (to.name === 'NotFound') {
    next() // 直接放行 404 路由
    return
  }

  const hasToken = userData.getters.get_token !== ''

  if (to.meta.needLogin && !hasToken) {
    next({ name: 'Login', query: { redirect: location.pathname } })
  }
  if (to.meta.autoRedirectLogined && hasToken) {
    next({ name: 'Dashboard' })
  }
  next()
})

// from next
router.afterEach((to) => {
  finishLoadingBar()
  if (to.meta.title) {
    // 设置标题
    document.title = to.meta.title + ' | LoCyanFrp'
  }

  // 需要登录则展示主 sidebar
  if (to.meta.needLogin) {
    changeMainSideBarShow(true)
    changeShowGuestSideBar(false)
  } else {
    changeMainSideBarShow(false)
    changeShowGuestSideBar(false)
  }

  if (userData.getters.get_token) {
    setSideBarActiveKey(to.name)
  } else {
    setGuestSideBarActiveKey(to.name)
  }
})

export default router
