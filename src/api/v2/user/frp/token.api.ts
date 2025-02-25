import base from '@/api/base'
//@ts-ignore
import { get, post } from '@/utils/request'

const getToken = async (user_id: number) => {
  const rs = await get(`/user/frp/token`, {
    user_id: user_id
  })
  return base.buildResponse(rs)
}

const postToken = async (user_id: number) => {
  const rs = await post(`/user/frp/token`, {
    user_id: user_id
  })
  return base.buildResponse(rs)
}

const token = {
  get: getToken,
  post: postToken
}

export default token
