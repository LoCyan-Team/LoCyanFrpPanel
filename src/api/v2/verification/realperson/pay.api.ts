import base from '@/api/base'
import { get } from '@/utils/request'

export default class Pay {
  async get(params: { userId: number }) {
    const rs = await get(`/verification/realperson/pay`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
