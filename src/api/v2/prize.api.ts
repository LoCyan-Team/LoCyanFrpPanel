import base from '@/api/base'
import { get, post } from '@/utils/request'

export default class Prize {
  /**
   * 获取奖品信息
   */
  async get(params: { userId: number }) {
    const rs = await get(`/prize`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }

  /**
   * 参与抽奖
   */
  async post(params: { userId: number; prizeId: number }) {
    const rs = await post(`/prize`, {
      user_id: params.userId,
      prize_id: params.prizeId
    })
    return base.buildResponse(rs)
  }
}
