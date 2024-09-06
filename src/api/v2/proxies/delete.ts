import base from '@/api/base'
//@ts-ignore
import { deleteReq } from '@/utils/request'

const deleteX = async (username: string, proxy_id: number, token: string) => {
  const rs = deleteReq(`${base.api_v2_url}/proxies/delete`, {
    username: username,
    id: proxy_id,
    token: token
  })
  return base.buildResponse(await rs)
}

export default deleteX
