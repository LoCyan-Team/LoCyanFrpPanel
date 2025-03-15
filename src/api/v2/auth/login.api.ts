import { post } from '@/utils/request'
import base from '@/api/base'

export default class Login {
  /**
   * 登录
   */
  async post(params: {
    username: number
    password: string
    captchaId: string
    captchaToken: string
    captchaServer: string | undefined
  }) {
    const rs = await post(`/auth/login`, {
      username: params.username,
      password: params.password,
      captcha_id: params.captchaId,
      captcha_token: params.captchaToken,
      captcha_server: params.captchaServer
    })
    return base.buildResponse(rs)
  }
}
