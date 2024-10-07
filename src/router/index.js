import { createRouter, createWebHistory } from 'vue-router'
import { finishLoadingBar, startLoadingBar } from '@/utils/loadingbar'
import userData from '@/utils/stores/userData/store'
import logger from '@/utils/logger'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '/',
        name: 'MainPage',
        meta: {
          title: '首页',
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
        path: '/auth',
        children: [
          {
            path: 'login',
            name: 'Login',
            meta: {
              title: '登录',
              keepAlive: true,
              autoRedirectAfterLogin: true,
              sidebar: {
                guest: true
              }
            },
            component: () => import('@views/auth/LoginView.vue')
          },
          {
            path: 'register',
            name: 'Register',
            meta: {
              title: '注册',
              keepAlive: true,
              autoRedirectAfterLogin: true,
              sidebar: {
                guest: true
              }
            },
            component: () => import('@views/auth/RegisterView.vue')
          },
          {
            path: 'resetPassword',
            name: 'ResetPassword',
            meta: {
              title: '重置密码',
              keepAlive: true,
              autoRedirectAfterLogin: true,
              sidebar: {
                guest: true
              }
            },
            component: () => import('@views/auth/ResetPasswordView.vue')
          }
        ]
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
        path: '/games',
        children: [
          {
            path: 'minecraft',
            name: 'MinecraftGames',
            meta: {
              name: 'Minecraft 联机',
              keepAlive: true,
              needLogin: true
            },
            component: () => import('@views/games/MinecraftView.vue')
          }
        ]
      },
      {
        path: '/other',
        children: [
          {
            path: 'software',
            name: 'Software',
            meta: {
              title: '软件下载',
              keepAlive: true,
              needLogin: true
            },
            component: () => import('@views/other/SoftwareView.vue')
          }
        ]
      },
      {
        path: '/callback',
        children: [
          {
            path: 'auth',
            children: [
              {
                path: 'oauth',
                children: [
                  {
                    path: 'qq',
                    children: [
                      {
                        path: 'login',
                        name: 'LoginAuthCallback',
                        meta: {
                          title: 'QQ 登录回调页面',
                          needLogin: false
                        },
                        component: () => import('@/views/callback/auth/oauth/qq/LoginView.vue')
                      },
                      {
                        path: 'bind',
                        name: 'BindQQOAuthAuthCallback',
                        meta: {
                          title: 'QQ 绑定回调页面',
                          needLogin: false
                        },
                        component: () => import('@views/callback/auth/oauth/qq/BindView.vue')
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            path: 'verification',
            children: [
              {
                path: 'realperson',
                children: [
                  {
                    path: 'pay',
                    name: 'PayRealPersonVerificationCallback',
                    meta: {
                      title: '实人认证支付回调页面',
                      needLogin: false
                    },
                    component: () => import('@views/callback/verification/realperson/PayView.vue')
                  },
                  {
                    path: 'done',
                    name: 'DoneRealPersonVerificationCallback',
                    meta: {
                      title: '实人认证成功回调页面',
                      needLogin: false
                    },
                    component: () => import('@views/callback/verification/realperson/DoneView.vue')
                  }
                ]
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
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      top: 0,
      behavior: 'smooth'
    }
  },
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
  if (to.meta.autoRedirectAfterLogin && hasToken) {
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
})

export default router
