import Pay from './pay.api'

import { get, post, deleteReq } from '@/utils/request.ts'
import base from '@/api/base.ts'

export default class RealPerson {
  public pay = new Pay()

  async get(params: { userId: number }) {
    const rs = await get(`/verification/realperson`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }

  async post(params: { userId: number; name: string; idCard: string }) {
    const rs = await post(`/verification/realperson`, {
      user_id: params.userId,
      name: params.name,
      id_card: params.idCard
    })
    return base.buildResponse(rs)
  }

  async delete(params: { userId: number }) {
    const rs = await deleteReq(`/verification/realperson`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
