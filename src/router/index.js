import { createRouter, createWebHistory } from 'vue-router'
import { finishLoadingBar, startLoadingBar } from '@/utils/loadingbar'
import userData from '@/utils/stores/userData/store'
import { changeMainSidebarShow } from '@/components/nav/MainNav.vue'
import { changeShowGuestSidebar } from '@/components/nav/GuestNav.vue'
import { setSideBarActiveKey } from '@/components/sidebar/MainSidebar.vue'
import { setGuestSidebarActiveKey } from '@/components/sidebar/GuestSidebar.vue'
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
        path: '/auth/login',
        name: 'Login',
        meta: {
          title: '登录',
          keepAlive: true,
          autoRedirectLogined: true,
          sidebar: {
            guest: true
          }
        },
        component: () => import('@views/auth/LoginView.vue')
      },
      {
        path: '/auth/register',
        name: 'Register',
        meta: {
          title: '注册',
          keepAlive: true,
          autoRedirectLogined: true,
          sidebar: {
            guest: true
          }
        },
        component: () => import('@views/auth/RegisterView.vue')
      },
      {
        path: '/auth/resetPassword',
        name: 'ResetPassword',
        meta: {
          title: '重置密码',
          keepAlive: true,
          autoRedirectLogined: true,
          sidebar: {
            guest: true
          }
        },
        component: () => import('@views/auth/ResetPasswordView.vue')
      },
      {
        path: '/proxies',
        children: [
          {
            path: '',
            name: 'Proxies',
            meta: {
              title: '隧道列表',
              keepAlive: true,
              needLogin: true
            },
            component: () => import('@views/proxies/ProxiesView.vue')
          },
          {
            path: 'add',
            name: 'AddProxies',
            meta: {
              title: '添加隧道',
              keepAlive: true,
              needLogin: true
            },
            component: () => import('@views/proxies/AddView.vue')
          },
          {
            path: 'config',
            name: 'Config',
            meta: {
              title: '配置文件',
              keepAlive: true,
              needLogin: true
            },
            component: () => import('@views/proxies/ConfigView.vue')
          }
        ]
      },
      {
        path: '/verification',
        name: 'Verification',
        meta: {
          title: '身份认证',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@views/VerificationView.vue')
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
        path: '/other/software',
        name: 'Software',
        meta: {
          title: '软件下载',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@views/other/SoftwareView.vue')
      },
      {
        path: '/callback',
        children: [
          {
            path: 'auth',
            children: [
              {
                path: 'login',
                name: 'LoginAuthCallback',
                meta: {
                  title: '回调页面',
                  needLogin: false
                },
                component: () => import('@views/callback/auth/LoginView.vue')
              }
            ]
          }
        ]
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
    changeMainSidebarShow(true)
    changeShowGuestSidebar(false)
  } else {
    if (to.meta.sidebar?.guest) {
      changeShowGuestSidebar(true)
      changeMainSidebarShow(false)
    } else if (to.meta.sidebar?.main) {
      changeShowGuestSidebar(false)
      changeMainSidebarShow(true)
    } else {
      changeShowGuestSidebar(false)
      changeMainSidebarShow(false)
    }
  }

  if (userData.getters.get_token) {
    setSideBarActiveKey(to.name)
  } else {
    setGuestSidebarActiveKey(to.name)
  }
})

export default router
