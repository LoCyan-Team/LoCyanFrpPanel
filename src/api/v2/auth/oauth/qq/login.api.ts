import { get, post } from '@/utils/request'
import base from '@/api/base'

export default class Login {
  /**
   * 获取登录信息
   */
  async get() {
    const rs = await get(`/auth/oauth/qq/login`)
    return base.buildResponse(rs)
  }

  /**
   * 提交登录信息
   */
  async post(params: { code: string }) {
    const rs = await post(`/auth/oauth/qq/login`, {
      code: params.code
    })
    return base.buildResponse(rs)
  }
}
