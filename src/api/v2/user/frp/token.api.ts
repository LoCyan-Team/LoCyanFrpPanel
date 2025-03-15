import base from '@/api/base'
import { get, post } from '@/utils/request'

export default class Token {
  async get(params: { userId: number }) {
    const rs = await get(`/user/frp/token`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }

  async post(params: { userId: number }) {
    const rs = await post(`/user/frp/token`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
