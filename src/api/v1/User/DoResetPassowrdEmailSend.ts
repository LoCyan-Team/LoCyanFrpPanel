import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 发送重置密码邮件
 */
const DoResetPasswordEmailSend = async (username: string) => {
  // 2024-09-06 Muska_Ami: 怎么有人把 Password 打成 Passowrd，害的我还在想为什么 API 404
  const rs = get(`${base.api_v1_url}/User/DoResetPassowrdEmailSend`, {
    username: username
  })
  return base.buildResponse(await rs, false)
}

export default DoResetPasswordEmailSend
