//@ts-ignore
import { get } from '@/utils/request'
import base from '@/api/base'

const password = async (username: string) => {
  const rs = get(`${base.api_v2_url}/email/password`, {
    username: username
  })
  return base.buildResponse(await rs)
}

export default password
