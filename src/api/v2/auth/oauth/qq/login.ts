import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const login = async () => {
  const rs = await get(`${base.api_v2_url}/auth/oauth/qq/login`)
  return base.buildResponse(rs)
}

export default login
