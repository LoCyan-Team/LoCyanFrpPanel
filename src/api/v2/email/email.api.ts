//@ts-ignore
import { get } from '@/utils/request'
import base from '@/api/base'

const email = async (user_id: number, email: string) => {
  const rs = get(`/email/email`, {
    user_id: user_id,
    email: email
  })
  return base.buildResponse(await rs)
}

export default email
