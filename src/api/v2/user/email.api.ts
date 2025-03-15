import base from '@/api/base'
import { post } from '@/utils/request'

export default class Email {
  async post(params: { userId: number; verifyCode: string }) {
    const rs = await post(`/user/email`, {
      user_id: params.userId,
      verify_code: params.verifyCode
    })
    return base.buildResponse(rs)
  }
}
