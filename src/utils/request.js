import axios from 'axios'
import QS from 'qs'

// vuex
import userData from './stores/userData/store'
import router from '@router'
import Message from './message'
import logger from '@/utils/logger'

const message = new Message()

// 使用自定义的配置文件发送请求
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  timeout: 50000
})

const tokenDomains = ['api.locyanfrp.cn', 'backup.api.locyanfrp.cn', 'localhost']

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = userData.getters.get_token
    // 2024-09-07 Muska_Ami: 修复 Token 泄露问题 只有在指定域名请求时才应该添加 Token
    const url = new URL(config.baseURL + config.url)
    logger.info(url.hostname + ', ' + url.pathname + ', ' + tokenDomains.includes(url.hostname))
    if (token && tokenDomains.includes(url.hostname)) {
      // 已经登录成功，统一添加token
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => error
)

// 这里说一下token，一般是在登录完成之后，将用户的token通过localStorage或者cookie存在本地，
// 然后用户每次在进入页面的时候（即在main.js中），会首先从本地存储中读取token，如果token存在说明用户已经登陆过，
// 则更新vuex中的token状态。然后，在每次请求接口的时候，都会在请求的header中携带token，
// 后台人员就可以根据你携带的token来判断你的登录是否过期，如果没有携带，则说明没有登录过。
// 添加响应拦截器
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.log(error)
    // 对响应错误做点什么
    if (error.status) {
      switch (error.status) {
        case 401:
          router.replace({
            path: '/auth/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
          return error
        case 500:
          message.error('服务器响应时发生错误')
          return error
        default:
          return error
      }
    } else {
      let retryConfig = error.config
      // console.log(retryConfig)

      if (retryConfig.baseURL == import.meta.env.VITE_API_BACKUP_ENDPOINT) return error
      // 响应拦截器：捕获请求失败并尝试备用域名重试
      // 如果请求失败并且没有响应（通常是网络问题），尝试使用备用域名重试
      // console.log("Request failed, switching to backup domain...");

      retryConfig.baseURL = import.meta.env.VITE_API_BACKUP_ENDPOINT

      // 重试请求
      let retryResponse
      try {
        retryResponse = axios(retryConfig)
      } catch {
        return error
      }
      return retryResponse
    }
  }
)

/**
 * get方法，对应get请求
 * @param url
 * @param params
 */
export async function get(url, params) {
  return await instance.get(url, {
    params: params
  })
}

/**
 * post方法，对应post请求
 * @param url
 * @param params
 * @param headers
 */
export async function post(url, params, headers = {}) {
  return await instance.post(url, QS.stringify(params, { arrayFormat: 'repeat' }), {
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * delete方法，对应delete请求
 * @param url
 * @param params
 */
export async function deleteReq(url, params) {
  return await instance.delete(url, {
    params: params
  })
}

export function getUrlKey(name) {
  logger.info(window.location.href)
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] === name) {
      return pair[1]
    }
  }
  return null
}
