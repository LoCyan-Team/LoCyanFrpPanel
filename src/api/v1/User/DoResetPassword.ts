import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const DoResetPassword = async (password: string, confirm: string, code: string) => {
  const rs = get(`${base.api_v1_url}/User/DoResetPassword`, {
    password: password,
    confirm: confirm,
    code: code
  })
  return base.buildResponse(await rs, false)
}

export default DoResetPassword
