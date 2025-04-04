import base from '@/api/base'
//@ts-ignore
import { get, post, deleteReq } from '@/utils/request'

export default class ROOT {
  /**
   * 审核 ICP 备案域名
   */
  async post(params: { userId: number; domain: string }) {
    const rs = await post(`/icp`, {
      user_id: params.userId,
      domain: params.domain
    })
    return base.buildResponse(rs)
  }

  async delete(params: { userId: number; domainId: number }) {
    const rs = await deleteReq(`/icp`, {
      user_id: params.userId,
      id: params.domainId
    })
    return base.buildResponse(rs)
  }

  /**
   * 列出已审核 ICP 备案域名
   */
  async get(params: { userId: number }) {
    const rs = await get(`/icp`, {
      user_id: params.userId,
    })
    return base.buildResponse(rs)
  }
}