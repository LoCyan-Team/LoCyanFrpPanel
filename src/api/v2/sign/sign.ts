import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const sign = async (username: string) => {
  const rs = get(`${base.api_v2_url}/sign/sign`, {
    username: username
  })
  return base.buildResponse(await rs)
}

export default sign
