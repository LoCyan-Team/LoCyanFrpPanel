import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 获取公告
 * @returns {
 *   status: int,
 *   data: {
 *      url: string,
 *      name: string,
 *   }
 * }
 */
const GetCSApp = async () => {
  const rs = await get(`${base.api_v1_url}/App/GetCSApp`, {})
  return base.buildResponse(rs, false)
}

export default GetCSApp
