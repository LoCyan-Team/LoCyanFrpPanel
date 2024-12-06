//@ts-ignore
import { post } from '@/utils/request'
import base from '@/api/base'

const login = async (username: number, password: string, captcha_response_token: string) => {
  const rs = post(`${base.api_v2_url}/auth/login`, {
    username: username,
    password: password,
    captcha_response_token: captcha_response_token
  })
  return base.buildResponse(await rs)
}

export default login
