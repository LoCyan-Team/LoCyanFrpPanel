import { post } from '@/utils/request'
import base from '@/api/base'

export default class Authorize {
  /**
   * 授权
   */
  async post(params: {
    userId: number
    appId: number
    redirectUrl: string
    requestPermissionIds: Array<number>
  }) {
    const rs = await post(`/auth/oauth/authorize`, {
      user_id: params.userId,
      app_id: params.appId,
      redirect_url: params.redirectUrl,
      request_permission_ids: params.requestPermissionIds
    })
    return base.buildResponse(rs)
  }
}
