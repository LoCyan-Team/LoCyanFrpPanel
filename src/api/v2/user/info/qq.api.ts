import base from '@/api/base'
import { get } from '@/utils/request'

export default class QQ {
  async get(params: { userId: number }) {
    const rs = await get(`/user/info/qq`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
