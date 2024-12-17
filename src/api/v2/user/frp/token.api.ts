import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const token = async (user_id: number) => {
  const rs = await post(`${base.api_v2_url}/user/frp/token`, {
    user_id: user_id
  })
  return base.buildResponse(rs)
}

export default token
