import { post } from '@/utils/request'
import base from '@/api/base'

export default class Register {
  /**
   * 注册
   */
  async post(params: {
    username: string
    password: string
    email: string
    verifyCode: number
    qqCode: number
  }) {
    const rs = await post(`/auth/register`, {
      username: params.username,
      password: params.password,
      email: params.email,
      verify_code: params.verifyCode,
      qq_code: params.qqCode
    })
    return base.buildResponse(rs)
  }
}
