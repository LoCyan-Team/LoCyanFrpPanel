import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const down = async (username: string, proxy_id: string) => {
  const rs = get(`${base.api_v2_url}/proxies/down`, {
    username: username,
    proxy_id: proxy_id
  })
  return base.buildResponse(await rs)
}

export default down
