import { get } from '@/utils/request'
import base from '@/api/base'

export default class All {
  /**
   * 获取所有授权信息
   */
  async get(params: { userId: number }) {
    const rs = await get(`/auth/oauth/authorized/all`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
