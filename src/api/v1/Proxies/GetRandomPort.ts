import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 获取随机端口
 * @returns {
 *   status: int,
 *   data: {
 *      port: string
 *   }
 * }
 */
const GetRandomPort = async (id: number) => {
  const rs = await get(`${base.api_v1_url}/Proxies/GetRandomPort`, {
    id: id
  })
  return base.buildResponse(rs, false)
}

export default GetRandomPort
