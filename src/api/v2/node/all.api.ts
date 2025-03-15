import base from '@/api/base'
import { get } from '@/utils/request'

export default class All {
  /**
   * 获取所有节点
   */
  async get(params: { userId: number }) {
    const rs = await get(`/node/all`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
