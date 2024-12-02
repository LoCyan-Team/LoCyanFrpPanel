import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const password = async (
  user_id: number,
  verify_code: string
) => {
  const rs = await post(`${base.api_v2_url}/user/email`, {
    user_id: user_id,
    verify_code: verify_code
  })
  return base.buildResponse(rs)
}

export default password
