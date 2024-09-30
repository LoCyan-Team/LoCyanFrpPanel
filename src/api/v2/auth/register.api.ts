//@ts-ignore
import { post } from '@/utils/request'
import base from '@/api/base'

const register = async (
  username: string,
  password: string,
  email: string,
  verify_code: number,
  qq_code: number
) => {
  const rs = post(`${base.api_v2_url}/auth/register`, {
    username: username,
    password: password,
    email: email,
    verify_code: verify_code,
    qq_code: qq_code
  })
  return base.buildResponse(await rs)
}

export default register
