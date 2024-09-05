import base from '@/api/base'
import { get } from '@/utils/request'

/**
 * 获取公告
 * @returns {
 *   status: int,
 *   data: {
 *      broadcast: string
 *   }
 * }
 */
const GetBroadCast = async () => {
    const rs = await get(`${base.api_v1_url}/App/GetBroadCast`, {})
    return base.buildResponse(rs, false)
}

export default GetBroadCast
