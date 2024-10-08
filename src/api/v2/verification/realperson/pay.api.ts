import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const pay = async (username: string) => {
  const rs = get(`${base.api_v2_url}/verification/realperson/pay`, {
    username: username
  })
  return base.buildResponse(await rs)
}

export default pay
