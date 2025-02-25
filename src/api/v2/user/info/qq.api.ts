import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const qq = async (user_id: number) => {
  const rs = await get(`/user/info/qq`, {
    user_id: user_id
  })
  return base.buildResponse(rs)
}

export default qq
