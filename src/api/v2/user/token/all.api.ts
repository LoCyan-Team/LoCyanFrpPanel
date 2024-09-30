import base from '@/api/base'
//@ts-ignore
import { deleteReq } from '@/utils/request'

const all = async (username: string) => {
  const rs = await deleteReq(`${base.api_v2_url}/user/token/all`, {
    username: username
  })
  return base.buildResponse(rs)
}

export default all
