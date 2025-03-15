import base from '@/api/base'
import { get } from '@/utils/request'

export default class All {
  /**
   * 获取所有捐赠记录
   */
  async get(params: { userId: number | undefined }) {
    const rs = await get(`/donate/say/all`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
