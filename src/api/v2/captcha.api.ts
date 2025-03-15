import base from '@/api/base'
import { get } from '@/utils/request'

export default class Captcha {
  async get(params: { action: string }) {
    const rs = await get(`/captcha`, {
      action: params.action
    })
    return base.buildResponse(rs)
  }
}
