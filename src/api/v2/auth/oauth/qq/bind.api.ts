import base from '@/api/base'
//@ts-ignore
import { get, post, deleteReq } from '@/utils/request'

const getBind = async (user_id: number) => {
  const rs = await get(`/auth/oauth/qq/bind`, {
    user_id: user_id
  })
  return base.buildResponse(rs)
}

const postBind = async (user_id: number, code: string) => {
  const rs = await post(`/auth/oauth/qq/bind`, {
    user_id: user_id,
    code: code
  })
  return base.buildResponse(rs)
}

const deleteBind = async (user_id: number) => {
  const rs = await deleteReq(`/auth/oauth/qq/bind`, {
    user_id: user_id
  })
  return base.buildResponse(rs)
}

const bind = {
  get: getBind,
  post: postBind,
  delete: deleteBind
}

export default bind
