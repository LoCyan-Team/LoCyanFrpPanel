import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const SendEditMail = async (username: string, token: string, email: string) => {
  const rs = await get(`${base.api_v1_url}/Account/SendEditMail`, {
    username: username,
    token: token,
    email: email
  })
  return base.buildResponse(rs, false)
}

export default SendEditMail
