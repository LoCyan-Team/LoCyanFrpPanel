import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const down = async (user_id: number, proxy_id: string) => {
  const rs = post(`${base.api_v2_url}/proxy/down`, {
    user_id: user_id,
    proxy_id: proxy_id
  })
  return base.buildResponse(await rs)
}

export default down
