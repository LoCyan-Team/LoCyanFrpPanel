//@ts-ignore
import { get } from '@/utils/request'
import base from '@/api/base'

const all = async (user_id: number) => {
  const rs = get(`/app/all`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

export default all
