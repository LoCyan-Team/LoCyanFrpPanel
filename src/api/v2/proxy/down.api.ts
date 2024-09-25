import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const down = async (username: string, proxy_id: string) => {
  const rs = post(`${base.api_v2_url}/proxy/down`, {
    username: username,
    proxy_id: proxy_id
  })
  return base.buildResponse(await rs)
}

export default down
