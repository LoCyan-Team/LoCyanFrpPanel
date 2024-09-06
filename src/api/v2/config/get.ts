import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 暂时无法使用
 */
const getX = async (node_id: number) => {
  const rs = get(`${base.api_v2_url}/config/get`, {
    id: node_id
  })
  return base.buildResponse(await rs)
}

export default getX
