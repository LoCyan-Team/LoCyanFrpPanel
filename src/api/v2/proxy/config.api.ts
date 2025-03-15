import base from '@/api/base'
import { get } from '@/utils/request'

export default class Config {
  /**
   * 获取单个隧道配置文件
   */
  async get(params: { userId: number; proxyId: number; nodeId: number }) {
    const rs = await get(`/proxy/config`, {
      user_id: params.userId,
      proxy_id: params.proxyId,
      node_id: params.nodeId
    })
    return base.buildResponse(rs)
  }
}
