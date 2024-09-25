import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const content = async (username: string, token: string) => {
    const rs = get(`${base.api_v2_url}/notice/content`, {
      username: username,
      token: token
    })
    return base.buildResponse(await rs)
  }

export default content