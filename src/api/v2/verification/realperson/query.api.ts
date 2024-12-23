import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const query = async (user_id: number, certify_id: string) => {
  const rs = get(`${base.api_v2_url}/verification/realperson/query`, {
    user_id: user_id,
    certify_id: certify_id
  })
  return base.buildResponse(await rs)
}

export default query
