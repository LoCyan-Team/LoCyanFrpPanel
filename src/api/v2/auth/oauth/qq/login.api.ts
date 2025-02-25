import base from '@/api/base'
//@ts-ignore
import { get, post } from '@/utils/request'

const getLogin = async () => {
  const rs = await get(`/auth/oauth/qq/login`)
  return base.buildResponse(rs)
}

const postLogin = async (code: string) => {
  const rs = await post(`/auth/oauth/qq/login`, {
    code: code
  })
  return base.buildResponse(rs)
}

const login = {
  get: getLogin,
  post: postLogin
}

export default login
