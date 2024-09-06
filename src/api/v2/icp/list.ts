import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 列出已审核 ICP 备案域名
 */
const list = async (username: string, token: string) => {
  const rs = get(`${base.api_v2_url}/icp/list`, {
    username: username,
    token: token
  })
  return base.buildResponse(await rs)
}

export default list
