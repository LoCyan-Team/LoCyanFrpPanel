import { get } from '@/utils/request'
import base from '@/api/base'

export default class Image {
  async get(params: { userId: number; domain: string }) {
    const rs = await get('/icp/miit/image', {
      user_id: params.userId,
      domain: params.domain
    })
    return base.buildResponse(rs)
  }
}
