import List from './list.api'
import Info from './info.api'
import Say from './say'

import base from '@/api/base'
import { post } from '@/utils/request'

export default class Donate {
  public list = new List()
  public info = new Info()
  public say = new Say()

  /**
   * 创建捐赠订单
   */
  async post(params: { userId: number; money: string }) {
    const rs = await post(`/donate`, {
      user_id: params.userId,
      money: params.money
    })
    return base.buildResponse(rs)
  }
}
