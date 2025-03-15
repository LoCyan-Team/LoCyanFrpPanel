import base from '@/api/base'
import { post } from '@/utils/request'

export default class Traffic {
  async post(params: { userId: number }) {
    const rs = await post(`/user/traffic`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
