import All from './all.api'

import { get, deleteReq } from '@/utils/request'
import base from '@/api/base.ts'

export default class Token {
  public all = new All()

  async get(params: { userId: number }) {
    const rs = await get(`/user/token`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }

  async delete(params: { userId: number }) {
    const rs = deleteReq(`/user/token`, {
      user_id: params.userId
    })
    return base.buildResponse(await rs)
  }
}
