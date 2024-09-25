import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const token = async (username: string) => {
  const rs = await post(`${base.api_v2_url}/user/frp/token`, {
    username: username
  })
  return base.buildResponse(rs)
}

export default token
