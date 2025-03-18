export default [
  {
    path: '/',
    children: [
      {
        path: '/',
        redirect: '/auth/login'
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        meta: {
          title: '仪表盘',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@/views/DashboardView.vue')
      },
      {
        path: '/sign',
        name: 'Sign',
        meta: {
          title: '签到',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@/views/SignView.vue')
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
            component: () => import('@/views/auth/LoginView.vue')
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
            component: () => import('@/views/auth/RegisterView.vue')
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
            component: () => import('@/views/auth/ResetPasswordView.vue')
          },
          {
            path: 'oauth',
            children: [
              {
                path: 'authorize',
                name: 'OAuthAuthorize',
                meta: {
                  title: 'OAuth 授权界面',
                  needLogin: true,
                  noSidebar: true
                },
                component: () => import('@/views/auth/oauth/AppAuthView.vue')
              }
            ]
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
            component: () => import('@/views/proxies/ProxiesView.vue')
          },
          {
            path: 'add',
            name: 'AddProxies',
            meta: {
              title: '添加隧道',
              keepAlive: true,
              needLogin: true
            },
            component: () => import('@/views/proxies/AddView.vue')
          },
          {
            path: 'config',
            name: 'Config',
            meta: {
              title: '配置文件',
              keepAlive: true,
              needLogin: true
            },
            component: () => import('@/views/proxies/ConfigView.vue')
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
        component: () => import('@/views/VerificationView.vue')
      },
      {
        path: '/activites',
        name: 'Activites',
        children: [
          {
            path: 'newyear',
            name: 'NewYear',
            children: [
              {
                path: 'comment',
                name: 'CommentNewYear',
                meta: {
                  title: '留言',
                  keepAlive: true,
                  needLogin: true
                },
                component: () => import('@/views/activites/newyear/NewYearView.vue')
              },
              {
                path: 'prize',
                name: 'PrizeNewYear',
                meta: {
                  title: '抽奖',
                  keepAlive: true,
                  needLogin: true
                },
                component: () => import('@/views/activites/newyear/PrizeView.vue')
              }
            ]
          },
        ],
      },
      {
        path: '/donate',
        name: 'Donate',
        meta: {
          title: '赞助',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@/views/DonateView.vue')
      },
      {
        path: '/icp',
        name: 'Icp',
        meta: {
          title: '域名白名单',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@/views/IcpCheckView.vue')
      },
      {
        path: '/apps',
        name: 'App',
        children: [
          {
            path: 'management',
            name: 'AppManagement',
            meta: {
              title: '应用管理',
              keepAlive: true,
              needLogin: true
            },
            component: () => import('@/views/apps/ManagementView.vue')
          },
          {
            path: 'access',
            name: 'AppAccess',
            meta: {
              title: '授权管理',
              keepAlive: true,
              needLogin: true
            },
            component: () => import('@/views/apps/AccessManagementView.vue')
          }
        ]
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
            component: () => import('@/views/games/MinecraftView.vue')
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
            component: () => import('@/views/other/SoftwareView.vue')
          }
        ]
      },
      {
        path: '/me',
        name: 'Me',
        meta: {
          title: '用户资料',
          keepAlive: true,
          needLogin: true
        },
        component: () => import('@/views/UserView.vue')
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
                        name: 'QQLoginOAuthCallback',
                        meta: {
                          title: 'QQ 登录回调页面',
                          needLogin: false
                        },
                        component: () => import('@/views/callback/auth/oauth/qq/LoginView.vue')
                      },
                      {
                        path: 'bind',
                        name: 'BindQQOAuthCallback',
                        meta: {
                          title: 'QQ 绑定回调页面',
                          needLogin: true,
                          noSidebar: true
                        },
                        component: () => import('@/views/callback/auth/oauth/qq/BindView.vue')
                      }
                    ]
                  },
                  {
                    path: 'localhost',
                    name: 'OAuthLocalCallback',
                    meta: {
                      title: '本地重定向界面',
                      needLogin: false
                    },
                    component: () => import('@/views/callback/auth/oauth/LocalRedirectView.vue')
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
                    component: () => import('@/views/callback/verification/realperson/PayView.vue')
                  },
                  {
                    path: 'done',
                    name: 'DoneRealPersonVerificationCallback',
                    meta: {
                      title: '实人认证回调页面',
                      needLogin: true,
                      noSidebar: true
                    },
                    component: () =>
                      import('@/views/callback/verification/realperson/QueryView.vue')
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
        component: () => import('@/views/NotFoundView.vue')
      }
    ]
  }
]
