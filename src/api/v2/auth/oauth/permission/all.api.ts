import { get } from '@/utils/request'
import base from '@/api/base'

export default class Permission {
  /**
   * 获取所有权限
   */
  async get(params: { userId: number }) {
    const rs = await get(`/auth/oauth/permission/all`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
