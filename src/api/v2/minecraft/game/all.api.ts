import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const all = async (username: string) => {
  const rs = await get(`${base.api_v2_url}/minecraft/game/all`, {
    username: username
  })
  return base.buildResponse(rs)
}

export default all
