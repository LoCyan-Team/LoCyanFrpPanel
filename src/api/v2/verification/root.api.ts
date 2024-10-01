import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const getVerification = async (username: string) => {
  const rs = get(`${base.api_v2_url}/verification`, {
    username: username
  })
  return base.buildResponse(await rs)
}

const verification = {
  get: getVerification
}

export default verification