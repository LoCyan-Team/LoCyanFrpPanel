//@ts-ignore
import { get, deleteReq } from '@/utils/request'
import base from '@/api/base'

const getToken = async (user_id: number) => {
  const rs = get(`/user/token`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

const deleteToken = async (user_id: number) => {
  const rs = deleteReq(`/user/token`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

const token = {
  get: getToken,
  delete: deleteToken
}

export default token
