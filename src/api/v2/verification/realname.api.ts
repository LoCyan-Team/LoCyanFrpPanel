import base from '@/api/base'
import { post } from '@/utils/request'

export default class RealName {
  async post(params: { userId: number; name: string; idCard: string }) {
    const rs = await post(`/verification/realname`, {
      user_id: params.userId,
      name: params.name,
      id_card: params.idCard
    })
    return base.buildResponse(rs)
  }
}
