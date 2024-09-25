//@ts-ignore
import { get } from '@/utils/request'
import base from '@/api/base'

const info = async (username: string) => {
  const rs = get(`${base.api_v2_url}/user/info`, {
    username: username
  })
  return base.buildResponse(await rs)
}

export default info
