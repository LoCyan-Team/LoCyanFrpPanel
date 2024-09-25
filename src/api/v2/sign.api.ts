import base from '@/api/base'
//@ts-ignore
import { get, post } from '@/utils/request'

const getSign = async (username: string) => {
  const rs = get(`${base.api_v2_url}/sign`, {
    username: username
  })
  return base.buildResponse(await rs)
}

const postSign = async (username: string) => {
  const rs = post(`${base.api_v2_url}/sign`, {
    username: username
  })
  return base.buildResponse(await rs)
}

const sign = {
  get: getSign,
  post: postSign
}

export default sign
