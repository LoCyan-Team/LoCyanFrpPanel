import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const getVerification = async (user_id: number) => {
  const rs = get(`${base.api_v2_url}/verification`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

const verification = {
  get: getVerification
}

export default verification
