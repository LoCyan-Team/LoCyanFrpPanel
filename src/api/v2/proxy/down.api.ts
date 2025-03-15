import base from '@/api/base'
import { post } from '@/utils/request'

export default class Down {
  async post(params: { userId: number; proxyId: string }) {
    const rs = await post(`/proxy/down`, {
      user_id: params.userId,
      proxy_id: params.proxyId
    })
    return base.buildResponse(rs)
  }
}
