import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const password = async (
  user_id: number | undefined,
  email: string | undefined,
  old_password: string | undefined,
  new_password: string,
  verify_code: string | undefined
) => {
  const rs = await post(`/user/password`, {
    user_id: user_id,
    email: email,
    old_password: old_password,
    new_password: new_password,
    verify_code: verify_code
  })
  return base.buildResponse(rs)
}

export default password
