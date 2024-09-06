//@ts-ignore
import { get } from '@/utils/request'
import base from '@/api/base'

const send = async (email: string) => {
  const rs = get(`${base.api_v2_url}/users/send`, {
    email: email
  })
  return base.buildResponse(await rs)
}

export default send
