//@ts-ignore
import { get } from '@/utils/request'
import base from '@/api/base'

const register = async (
  email: string,
  captcha_id: string,
  captcha_token: string,
  captcha_server: string | undefined
) => {
  const rs = get(`/email/register`, {
    email: email,
    captcha_id: captcha_id,
    captcha_token: captcha_token,
    captcha_server: captcha_server
  })
  return base.buildResponse(await rs)
}

export default register
