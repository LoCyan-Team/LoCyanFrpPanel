//@ts-ignore
import { get } from '@/utils/request'
import base from '@/api/base'

const register = async (email: string) => {
  const rs = get(`${base.api_v2_url}/email/register`, {
    email: email
  })
  return base.buildResponse(await rs)
}

export default register
