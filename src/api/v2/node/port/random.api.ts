import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const random = async (user_id: number, node_id: number) => {
  const rs = get(`/node/port/random`, {
    user_id: user_id,
    node_id: node_id
  })
  return base.buildResponse(await rs)
}

export default random
