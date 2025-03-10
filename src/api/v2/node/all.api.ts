import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const all = async (user_id: number) => {
  const rs = get(`/node/all`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

export default all
