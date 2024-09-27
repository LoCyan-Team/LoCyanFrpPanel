import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const qq = async (username: string) => {
  const rs = await get(`${base.api_v2_url}/user/info/qq`, {
    username: username
  })
  return base.buildResponse(rs)
}

export default qq
