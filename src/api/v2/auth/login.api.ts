//@ts-ignore
import { post } from '@/utils/request'
import base from '@/api/base'

const login = async (
  username: number,
  password: string,
  captcha_id: string,
  captcha_token: string,
  captcha_server: string | undefined
) => {
  const rs = post(`/auth/login`, {
    username: username,
    password: password,
    captcha_id: captcha_id,
    captcha_token: captcha_token,
    captcha_server: captcha_server
  })
  return base.buildResponse(await rs)
}

export default login
