import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const token = async (token: string) => {
  const rs = await get(`${base.api_v2_url}/oauth/login/token`, {
    token: token
  })
  return base.buildResponse(rs)
}

export default token
