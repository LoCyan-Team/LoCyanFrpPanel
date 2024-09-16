import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const traffic = async (username: string) => {
  const rs = await get(`${base.api_v2_url}/users/reset/traffic`, {
    username: username
  })
  return base.buildResponse(rs)
}

export default traffic
