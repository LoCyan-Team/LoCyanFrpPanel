import { get, post, deleteReq } from '@/utils/request'
import base from '@/api/base'

export default class Bind {
  /**
   * 获取绑定信息
   */
  async get(params: { userId: number }) {
    const rs = await get(`/auth/oauth/qq/bind`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }

  /**
   * 绑定
   */
  async post(params: { userId: number; code: string }) {
    const rs = await post(`/auth/oauth/qq/bind`, {
      user_id: params.userId,
      code: params.code
    })
    return base.buildResponse(rs)
  }

  /**
   * 删除绑定
   */
  async delete(params: { userId: number }) {
    const rs = await deleteReq(`/auth/oauth/qq/bind`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
