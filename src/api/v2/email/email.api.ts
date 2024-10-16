//@ts-ignore
import { get } from '@/utils/request'
import base from '@/api/base'

const email = async (username: string, email: string) => {
  const rs = get(`${base.api_v2_url}/email/email`, {
    username: username,
    email: email
  })
  return base.buildResponse(await rs)
}

export default email
