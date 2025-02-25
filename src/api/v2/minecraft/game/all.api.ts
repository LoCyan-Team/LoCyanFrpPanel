import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const all = async (user_id: number) => {
  const rs = await get(`/minecraft/game/all`, {
    user_id: user_id
  })
  return base.buildResponse(rs)
}

export default all
