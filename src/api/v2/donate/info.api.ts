import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 获取捐赠订单信息
 */
const list = async (user_id: number, trade_no: string) => {
  const rs = get(`${base.api_v2_url}/donate/info`, {
    user_id: user_id,
    trade_no: trade_no
  })
  return base.buildResponse(await rs)
}

export default list
