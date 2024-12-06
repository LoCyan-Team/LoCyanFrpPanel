//@ts-ignore
import { get } from '@/utils/request'
import base from '@/api/base'

const email = async (user_id: number, email: string) => {
  const rs = get(`${base.api_v2_url}/email/email`, {
    user_id: user_id,
    email: email
  })
  return base.buildResponse(await rs)
}

export default email
