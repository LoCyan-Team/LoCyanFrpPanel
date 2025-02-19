// 封装axios
import axios from 'axios'
// 序列化
import QS from 'qs'
// vuex
import userData from './stores/userData/store'
import router from '@router'
import Base64 from 'qs/lib/utils'
import Message from './message'
import logger from '@/utils/logger'

const message = new Message()

//这一步的目的是判断出当前是开发环境还是生成环境，方法不止一种，达到目的就行
// if(process.env.NODE_ENV=="development"){
//   baseURL='https://api.locyanfrp.cn'
// }else{
//   baseURL='http://127.0.0.1:8081'
// }

// 使用自定义的配置文件发送请求
const instance = axios.create({
  timeout: 80000
})

const tokenDomains = ['api.locyanfrp.cn', 'api-v2.locyanfrp.cn', 'localhost']

// 添加请求拦截器
instance.interceptors.request.use(
  async (config) => {
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = userData.getters.get_token
    // 2024-09-07 Muska_Ami: 修复 Token 泄露问题 只有在指定域名请求时才应该添加 Token
    const url = new URL(config.url)
    logger.info(url.hostname + ', ' + url.pathname + ', ' + tokenDomains.includes(url.hostname))
    if (token && tokenDomains.includes(url.hostname)) {
      // 已经登录成功，统一添加token
      config.headers.Authorization = `Bearer ${token}`
    }
    // token && (config.headers.Authorization = token);
    return config
  },
  async (error) => await error
)

// 这里说一下token，一般是在登录完成之后，将用户的token通过localStorage或者cookie存在本地，
// 然后用户每次在进入页面的时候（即在main.js中），会首先从本地存储中读取token，如果token存在说明用户已经登陆过，
// 则更新vuex中的token状态。然后，在每次请求接口的时候，都会在请求的header中携带token，
// 后台人员就可以根据你携带的token来判断你的登录是否过期，如果没有携带，则说明没有登录过。
// 添加响应拦截器
instance.interceptors.response.use(
  async (response) => response,
  async (error) => {
    // 对响应错误做点什么
    if ((await error).status) {
      switch ((await error).status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          router.replace({
            path: '/auth/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
          break
        case 500:
          message.error('服务器响应时发生错误')
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        // case 403:
        //     sendErrorMessage("登录过期, 请重新登陆");
        //     // 清除token
        //     logout();
        //     // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
        //     setTimeout(() => {
        //         router.replace({
        //             path: "/login",
        //             query: {
        //                 redirect: router.currentRoute.fullPath,
        //             },
        //         });
        //     }, 1000);
        //     break;
        // 404请求不存在
        // case 404:
        //   sendErrorMessage('请求的资源不存在')
        //   break
        // 其他错误，直接抛出错误提示
        default:
          // sendErrorMessage(error.response.data.data.msg)
          return await error
      }
      return await error
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
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' }
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
  // let path = window.location.href.split('?') //分割url
  // // 拼接链接
  // let href = path[0] + '?' + path[1]
  // // 如果不存在则抛出null
  // if (path[1] === null || path[1] === '' || path[1] === undefined) {
  //   return null
  // }
  // let query = Base64.decode(path[1]) //解码
  // href = path[0] + '?' + query //解码后重组
  // return (
  //   decodeURIComponent(
  //     (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(href) || [
  //       undefined,
  //       ''
  //     ])[1].replace(/\+/g, '%20')
  //   ) || null
  // )
}
