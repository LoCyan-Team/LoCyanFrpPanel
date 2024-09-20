import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const list = async (username: string) => {
  const rs = get(`${base.api_v2_url}/proxies/list`, {
    username: username
  })
  return base.buildResponse(await rs)
}

export default list
