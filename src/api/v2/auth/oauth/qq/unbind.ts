import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const unbind = async (username: string) => {
  const rs = await get(`${base.api_v2_url}/auth/oauth/qq/unbind`, {
    username: username
  })
  return base.buildResponse(rs)
}

export default unbind
