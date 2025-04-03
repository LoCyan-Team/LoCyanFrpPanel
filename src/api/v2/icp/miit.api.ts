import base from '@/api/base'
//@ts-ignore
import { get, post } from '@/utils/request'

/**
 * 审核 ICP 备案域名
 */
const getMiitImage = async (user_id: string, domain: string) => {
  const rs = get(`${base.api_v2_url}/icp/miit/image`, {
    user_id: user_id,
    domain: domain,
  })
  return base.buildResponse(await rs)
}

const getQuerySign = async (point_json: string, token: string, uuid_token: string, secret_key: string, client_uid: string) => {
  const rs = post(`${base.api_v2_url}/icp/miit/sign`, {
    point_json: point_json,
    token: token,
    uuid_token: uuid_token,
    secret_key: secret_key,
    client_uid: client_uid
  })
  return base.buildResponse(await rs)
}

const queryDomain = async (domain: string, sign: string, uuid_token: string, token: string, user_id: string) => {
  const rs = post(`${base.api_v2_url}/icp/miit/query`, {
    domain: domain,
    sign: sign,
    uuid_token: uuid_token,
    token: token,
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

const miit = {
    getMiitImage: getMiitImage,
    getQuerySign: getQuerySign,
    queryDomain: queryDomain,
}

export default miit