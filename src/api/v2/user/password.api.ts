import base from '@/api/base'
import { post } from '@/utils/request'

export default class Password {
  async post(params: {
    userId: number | undefined
    email: string | undefined
    oldPassword: string | undefined
    newPassword: string
    verifyCode: string | undefined
  }) {
    const rs = await post(`/user/password`, {
      user_id: params.userId,
      email: params.email,
      old_password: params.oldPassword,
      new_password: params.newPassword,
      verify_code: params.verifyCode
    })
    return base.buildResponse(rs)
  }
}
