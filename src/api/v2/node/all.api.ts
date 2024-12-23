import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const all = async (user_id: number) => {
  const rs = get(`${base.api_v2_url}/node/all`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

export default all
