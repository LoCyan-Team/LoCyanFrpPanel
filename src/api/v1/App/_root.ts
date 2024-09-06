import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 获取通知
 * @returns {
 *   status: int,
 *   data: {
 *      ads: string,
 *      content: string
 *   }
 * }
 */
const root = async () => {
  const rs = await get(`${base.api_v1_url}/App`, {})
  return base.buildResponse(rs, false)
}

export default root
