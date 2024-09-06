//@ts-ignore
import { post } from '@/utils/request'
import base from '@/api/base'

const login = async (username: string, password: string) => {
  const rs = post(`${base.api_v2_url}/users/login`, {
    username: username,
    password: password
  })
  return base.buildResponse(await rs)
}

export default login
