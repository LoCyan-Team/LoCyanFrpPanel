import { post } from '@/utils/request'
import base from '@/api/base'

export default class Sign {
  async post(params: {
    userId: number
    pointJson: string
    token: string
    uuidToken: string
    secretKey: string
    clientUid: string
  }) {
    const rs = await post('/icp/miit/sign', {
      user_id: params.userId,
      point_json: params.pointJson,
      token: params.token,
      uuid_token: params.uuidToken,
      secret_key: params.secretKey,
      client_uid: params.clientUid
    })
    return base.buildResponse(rs)
  }
}
