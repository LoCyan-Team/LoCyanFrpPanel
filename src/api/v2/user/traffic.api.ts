import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const traffic = async (user_id: number) => {
  const rs = await post(`/user/traffic`, {
    user_id: user_id
  })
  return base.buildResponse(rs)
}

export default traffic
