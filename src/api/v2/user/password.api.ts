import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const password = async (
  user_id: number,
  old_password: string | undefined,
  new_password: string,
  verify_code: string | undefined
) => {
  const rs = await post(`${base.api_v2_url}/user/password`, {
    user_id: user_id,
    old_password: old_password,
    new_password: new_password,
    verify_code: verify_code
  })
  return base.buildResponse(rs)
}

export default password
