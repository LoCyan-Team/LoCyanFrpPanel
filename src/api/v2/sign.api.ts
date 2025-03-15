import base from '@/api/base'
//@ts-ignore
import { get, post } from '@/utils/request'

export default class Sign {
  async get(params: { userId: number }) {
    const rs = await get('/sign', {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }

  async post(params: { userId: number }) {
    const rs = await post('/sign', {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
