import QQ from './qq.api'

import { get } from '@/utils/request.ts'
import base from '@/api/base.ts'

export default class Info {
  public qq = new QQ()

  async get(params: { userId: number }) {
    const rs = get(`/user/info`, {
      user_id: params.userId
    })
    return base.buildResponse(await rs)
  }
}
