import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import QS from 'qs'
import router from '@/router'
import Message from '@/utils/message'
import logger from '@/utils/logger'
import userData from '@/utils/stores/userData/store'

const message = new Message()

// 使用自定义的配置文件发送请求
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  timeout: 50000
})

const tokenDomains: string[] = ['api.locyanfrp.cn', 'backup.api.locyanfrp.cn', 'localhost']

// 添加请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = userData.getters.get_token
    const url = new URL(config.baseURL! + config.url!)
    logger.info(url.hostname + ', ' + url.pathname + ', ' + tokenDomains.includes(url.hostname))
    if (token && tokenDomains.includes(url.hostname)) {
      // 已经登录成功，统一添加token
      config.headers!.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    // 处理响应错误
    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 401:
          router.replace({
            path: '/auth/login',
            query: {
              redirect: router.currentRoute.value.fullPath
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
      const retryConfig = error.config
      // 如果请求失败并且没有响应，尝试备用域名重试
      if (retryConfig.baseURL === import.meta.env.VITE_API_BACKUP_ENDPOINT) return error
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
export async function get(url: string, params?: Record<string, any>): Promise<AxiosResponse> {
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
export async function post(
  url: string,
  params: Record<string, any>,
  headers: Record<string, string> = {}
): Promise<AxiosResponse> {
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
export async function deleteReq(url: string, params?: Record<string, any>): Promise<AxiosResponse> {
  return await instance.delete(url, {
    params: params
  })
}

export function getUrlKey(name: string): string | null {
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
