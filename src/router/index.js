import { createRouter, createWebHistory } from 'vue-router'
import { finishLoadingBar, startLoadingBar } from '@/utils/loadingbar'
import userData from '@/utils/stores/userData/store'
import logger from '@/utils/logger'
import routes from '@/router/routes'

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
    next({
      name: 'Login',
      query: { redirect: encodeURIComponent(location.pathname + location.search) }
    })
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
