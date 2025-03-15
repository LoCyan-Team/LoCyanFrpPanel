import RealName from './realname.api'
import RealPerson from './realperson'

import { get } from '@/utils/request'
import base from '@/api/base'

export default class Verification {
  public realname = new RealName()
  public realperson = new RealPerson()

  async get(params: { userId: number }) {
    const rs = await get(`/verification`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}
