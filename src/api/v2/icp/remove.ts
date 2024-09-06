import base from '@/api/base'
//@ts-ignore
import { deleteReq } from '@/utils/request'

const remove = async (username: string, token: string, domain_id: number) => {
  const rs = deleteReq(`${base.api_v2_url}/icp/remove`, {
    username: username,
    token: token,
    id: domain_id
  })
  return base.buildResponse(await rs)
}

export default remove
