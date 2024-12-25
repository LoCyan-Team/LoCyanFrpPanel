//@ts-ignore
import { get } from '@/utils/request'
import base from '@/api/base'

const password = async (user: number) => {
  const rs = get(`${base.api_v2_url}/email/password`, {
    user: user
  })
  return base.buildResponse(await rs)
}

export default password
