import base from '@/api/base'
import { get } from '@/utils/request'

export default class Random {
  /**
   * 获取随机节点端口
   */
  async get(params: { userId: number; nodeId: number }) {
    const rs = await get(`/node/port/random`, {
      user_id: params.userId,
      node_id: params.nodeId
    })
    return base.buildResponse(rs)
  }
}
