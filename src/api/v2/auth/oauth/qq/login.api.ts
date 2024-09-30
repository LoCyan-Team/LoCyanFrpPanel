import base from '@/api/base'
//@ts-ignore
import { get, post } from '@/utils/request'

const getLogin = async () => {
  const rs = await get(`${base.api_v2_url}/auth/oauth/qq/login`)
  return base.buildResponse(rs)
}

const postLogin = async (code: string) => {
  const rs = await post(`${base.api_v2_url}/auth/oauth/qq/login`, {
    code: code
  })
  return base.buildResponse(rs)
}

const login = {
  get: getLogin,
  post: postLogin
}

export default login
