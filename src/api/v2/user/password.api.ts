import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const password = async (
  username: string,
  old_password: string | null,
  new_password: string,
  verify_code: string | null
) => {
  const rs = await post(`${base.api_v2_url}/user/password`, {
    username: username,
    old_password: old_password,
    new_password: new_password,
    verify_code: verify_code
  })
  return base.buildResponse(rs)
}

export default password
