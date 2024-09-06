import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 审核 ICP 备案域名
 */
const check = async (username: string, token: string, domain: string) => {
  const rs = get(`${base.api_v2_url}/icp/check`, {
    username: username,
    token: token,
    domain: domain
  })
  return base.buildResponse(await rs)
}

export default check
