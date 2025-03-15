import { deleteReq } from '@/utils/request'
import base from '@/api/base'

export default class App {
  /**
   * 删除授权应用
   */
  async delete(params: { userId: number; appId?: number }) {
    const rs = await deleteReq(`/auth/oauth/authorized/app`, {
      user_id: params.userId,
      app_id: params.appId
    })
    return base.buildResponse(rs)
  }
}
