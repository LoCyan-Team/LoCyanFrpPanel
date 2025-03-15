import { deleteReq } from '@/utils/request'
import base from '@/api/base'

export default class Session {
  /**
   * 删除授权会话
   */
  async delete(params: { userId: number; appId: number; sessionId?: number }) {
    const rs = await deleteReq(`/auth/oauth/authorized/session`, {
      user_id: params.userId,
      app_id: params.appId,
      session_id: params.sessionId
    })
    return base.buildResponse(rs)
  }
}
