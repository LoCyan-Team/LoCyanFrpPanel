import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const content = async (user_id: number, token: string) => {
  const rs = get(`${base.api_v2_url}/notice/content`, {
    user_id: user_id,
    token: token
  })
  return base.buildResponse(await rs)
}

export default content
