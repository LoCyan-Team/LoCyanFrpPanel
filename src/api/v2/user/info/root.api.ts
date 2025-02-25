//@ts-ignore
import { get } from '@/utils/request'
import base from '@/api/base'

const getInfo = async (user_id: number) => {
  const rs = get(`/user/info`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

const info = {
  get: getInfo
}

export default info
