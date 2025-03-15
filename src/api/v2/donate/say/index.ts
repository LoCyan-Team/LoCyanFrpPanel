import All from './all.api'

import base from '@/api/base'
import { post } from '@/utils/request'

export default class Say {
  public all = new All()

  /**
   * 提交捐赠留言
   */
  async post(params: { userId: number; tradeNo: string; message: string }) {
    const rs = await post(`/donate/say`, {
      user_id: params.userId,
      trade_no: params.tradeNo,
      message: params.message
    })
    return base.buildResponse(rs)
  }
}
