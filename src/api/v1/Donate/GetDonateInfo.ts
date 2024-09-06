import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 列出赞助列表
 */
const GetDonateInfo = async (trade_no: string) => {
  const rs = get(`${base.api_v1_url}/Donate/GetDonateInfo`, {
    trade_no: trade_no
  })
  return base.buildResponse(await rs, false)
}

export default GetDonateInfo
