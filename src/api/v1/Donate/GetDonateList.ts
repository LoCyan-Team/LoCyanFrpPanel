import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 列出赞助列表
 */
const GetDonateList = async () => {
  const rs = get(`${base.api_v1_url}/Donate/GetDonateList`, {})
  return base.buildResponse(await rs, false)
}

export default GetDonateList
