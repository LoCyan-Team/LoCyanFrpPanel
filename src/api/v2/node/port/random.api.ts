import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const random = async (user_id: number, node_id: number) => {
  const rs = get(`${base.api_v2_url}/node/port/random`, {
    user_id: user_id,
    node_id: node_id
  })
  return base.buildResponse(await rs)
}

export default random
