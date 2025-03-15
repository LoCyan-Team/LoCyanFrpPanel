import { get } from '@/utils/request'
import base from '@/api/base'

export default class EmailX {
  /**
   * 发送重置邮箱邮件验证代码
   */
  async get(params: { userId: number; email: string }) {
    const rs = await get(`/email/email`, {
      user_id: params.userId,
      email: params.email
    })
    return base.buildResponse(rs)
  }
}
