import base from '@/api/base'
//@ts-ignore
import { get, post } from '@/utils/request'

export default class MIIT {
  /**
   * 审核 ICP 备案域名
   */
  async getMiitImage(params: {userId: string, domain: string}) {
    const rs = get("/icp/miit/image", {
      user_id: params.userId,
      domain: params.domain,
    })
    return base.buildResponse(rs)
  }

  async getQuerySign(params: {userId: string, pointJson: string, token: string, uuidToken: string, secretKey: string, clientUid: string}) {
    const rs = post("/icp/miit/sign", {
      user_id: params.userId,
      point_json: params.pointJson,
      token: params.token,
      uuid_token: params.uuidToken,
      secret_key: params.secretKey,
      client_uid: params.clientUid
    })
    return base.buildResponse(await rs)
  }

  async queryDomain(params: {domain: string, sign: string, uuidToken: string, token: string, userId: string}) {
    const rs = post("/icp/miit/sign", {
      domain: params.domain,
      sign: params.sign,
      uuid_token: params.uuidToken,
      token: params.token,
      user_id: params.userId
    })
    return base.buildResponse(await rs)
  }
}