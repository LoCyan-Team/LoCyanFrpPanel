import All from './all.api.ts'

import base from '@/api/base'
import { post, deleteReq } from '@/utils/request'

export default class Game {
  public all = new All()

  /**
   * 创建 Minecraft 游戏
   */
  async post(params: { userId: number; proxyId: number }) {
    const rs = await post(`/minecraft/game`, {
      user_id: params.userId,
      proxy_id: params.proxyId
    })
    return base.buildResponse(rs)
  }

  /**
   * 删除 Minecraft 游戏
   */
  async delete(params: { userId: number; code: number }) {
    const rs = await deleteReq(`/minecraft/game`, {
      user_id: params.userId,
      code: params.code
    })
    return base.buildResponse(rs)
  }
}
