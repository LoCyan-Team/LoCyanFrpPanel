import { get } from '@/utils/request'
import base from '@/api/base'

export default class Register {
  /**
   * 获取用户注册邮件验证代码
   */
  async get(params: { email: string; captchaToken: string }) {
    const rs = await get(`/email/register`, {
      email: params.email,
      captcha_token: params.captchaToken
    })
    return base.buildResponse(rs)
  }
}
