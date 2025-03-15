import base from '@/api/base'
import { get } from '@/utils/request'

export default class List {
  /**
   * 列出赞助列表
   */
  async get(params: { userId: number }) {
    const rs = await get(`/donate/list`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
