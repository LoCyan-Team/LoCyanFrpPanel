import base from '@/api/base'
import { get } from '@/utils/request'

export default class Info {
  /**
   * 获取捐赠订单信息
   */
  async get(params: { userId: number; tradeNo: string }) {
    const rs = await get(`/donate/info`, {
      user_id: params.userId,
      trade_no: params.tradeNo
    })
    return base.buildResponse(rs)
  }
}
