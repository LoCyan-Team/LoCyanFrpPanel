import { get } from '@/utils/request'
import base from '@/api/base'

export default class Password {
  /**
   * 发送重置密码邮件验证代码
   */
  async get(params: { user: string }) {
    const rs = await get(`/email/password`, {
      user: params.user
    })
    return base.buildResponse(rs)
  }
}
