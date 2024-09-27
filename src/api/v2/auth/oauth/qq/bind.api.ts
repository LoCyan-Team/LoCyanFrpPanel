import base from '@/api/base'
//@ts-ignore
import { get, post, deleteReq } from '@/utils/request'

const getBind = async (username: string) => {
  const rs = await get(`${base.api_v2_url}/auth/oauth/qq/bind`, {
    username: username
  })
  return base.buildResponse(rs)
}

const postBind = async (username: string) => {
  const rs = await get(`${base.api_v2_url}/auth/oauth/qq/bind`, {
    username: username
  })
  return base.buildResponse(rs)
}

const deleteBind = async (username: string) => {
  const rs = await deleteReq(`${base.api_v2_url}/auth/oauth/qq/bind`, {
    username: username
  })
  return base.buildResponse(rs)
}

const bind = {
  get: getBind,
  post: postBind,
  delete: deleteBind
}

export default bind
