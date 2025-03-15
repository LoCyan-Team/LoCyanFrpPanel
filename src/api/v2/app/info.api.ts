import { get } from '@/utils/request'
import base from '@/api/base'

export default class Info {
  /**
   * 获取应用信息
   */
  async get(params: { userId: number; appId: number }) {
    const rs = await get(`/app/info`, {
      user_id: params.userId,
      app_id: params.appId
    })
    return base.buildResponse(rs)
  }
}
