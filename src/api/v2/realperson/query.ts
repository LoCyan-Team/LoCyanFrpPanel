import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const query = async (username: string, certify_id: string) => {
  const rs = get(`${base.api_v2_url}/realperson/submit`, {
    username: username,
    certify_id: certify_id
  })
  return base.buildResponse(await rs)
}

export default query
