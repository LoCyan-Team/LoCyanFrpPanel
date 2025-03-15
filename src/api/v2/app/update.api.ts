import { post } from '@/utils/request'
import base from '@/api/base'

export default class Update {
  /**
   * 更新应用信息
   */
  async post(params: {
    userId: number
    appId: number
    appName: string
    appDescription: string | undefined
    redirectUrl: string | undefined
  }) {
    const rs = await post(`/app/update`, {
      user_id: params.userId,
      app_id: params.appId,
      app_name: params.appName,
      app_description: params.appDescription,
      redirect_url: params.redirectUrl
    })
    return base.buildResponse(rs)
  }
}
