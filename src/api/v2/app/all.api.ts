import { get } from '@/utils/request'
import base from '@/api/base'

export default class All {
  /**
   * 获取所有应用信息
   */
  async get(params: { userId: number }) {
    const rs = await get(`/app/all`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
