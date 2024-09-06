import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const get_status = async (username: string) => {
  const rs = get(`${base.api_v2_url}/realperson/get_status`, {
    username: username
  })
  return base.buildResponse(await rs)
}

export default get_status
