import { post } from '@/utils/request'
import base from '@/api/base'

export default class Query {
  async post(params: {domain: string, sign: string, uuidToken: string, token: string, userId: number}) {
    const rs = await post("/icp/miit/query", {
      domain: params.domain,
      sign: params.sign,
      uuid_token: params.uuidToken,
      token: params.token,
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }
}