import base from '@/api/base'
import { get } from '@/utils/request'

export default class All {
  /**
   * 获取所有隧道配置
   */
  async get(params: { userId: number }) {
    const rs = await get(`/proxy/all`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
