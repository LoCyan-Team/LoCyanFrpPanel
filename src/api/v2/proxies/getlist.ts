import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const getlist = async (username: string) => {
  const rs = get(`${base.api_v2_url}/proxies/getlist`, {
    username: username
  })
  return base.buildResponse(await rs)
}

export default getlist
