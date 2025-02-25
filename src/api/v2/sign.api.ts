import base from '@/api/base'
//@ts-ignore
import { get, post } from '@/utils/request'

const getSign = async (user_id: number) => {
  const rs = get(`/sign`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

const postSign = async (user_id: number) => {
  const rs = post(`/sign`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

const sign = {
  get: getSign,
  post: postSign
}

export default sign
