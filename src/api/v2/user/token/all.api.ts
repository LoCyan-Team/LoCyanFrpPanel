import base from '@/api/base'
import { deleteReq } from '@/utils/request'

export default class All {
  async delete(params: { userId: number }) {
    await deleteReq(`/user/token/all`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
