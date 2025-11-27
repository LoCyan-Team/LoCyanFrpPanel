import { post } from '@/utils/request'
import base from '@/api/base'

export default class Login {
  /**
   * 登录
   */
  async post(params: { username: number; password: string; captchaToken: string }) {
    const rs = await post(`/auth/login`, {
      username: params.username,
      password: params.password,
      captcha_token: params.captchaToken
    })
    return base.buildResponse(rs)
  }
}
