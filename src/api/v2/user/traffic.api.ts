import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const traffic = async (username: string) => {
  const rs = await post(`${base.api_v2_url}/user/traffic`, {
    username: username
  })
  return base.buildResponse(rs)
}

export default traffic
