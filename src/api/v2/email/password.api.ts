//@ts-ignore
import { get } from '@/utils/request'
import base from '@/api/base'

const password = async (user: string) => {
  const rs = get(`/email/password`, {
    user: user
  })
  return base.buildResponse(await rs)
}

export default password
