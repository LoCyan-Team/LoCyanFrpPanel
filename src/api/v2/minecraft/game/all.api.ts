import base from '@/api/base'
import { get } from '@/utils/request'

export default class All {
  /**
   * 获取所有 Minecraft 游戏
   */
  async get(params: { userId: number }) {
    const rs = await get(`/minecraft/game/all`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
