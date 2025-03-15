import base from '@/api/base'
import { get } from '@/utils/request'

export default class Content {
  /**
   * 获取通知内容
   */
  async get(params: { userId: number; token: string }) {
    const rs = await get(`/notice/content`, {
      user_id: params.userId,
      token: params.token
    })
    return base.buildResponse(rs)
  }
}
