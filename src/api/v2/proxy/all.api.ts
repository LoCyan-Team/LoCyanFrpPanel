import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const list = async (user_id: number) => {
  const rs = get(`/proxy/all`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

export default list
