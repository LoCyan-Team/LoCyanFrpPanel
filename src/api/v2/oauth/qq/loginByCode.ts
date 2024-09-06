import base from '@/api/base'
import { get } from '@/utils/request'

const loginByCode = async (code: string) => {
  const rs = await get(`${base.api_v2_url}/oauth/qq/loginByCode`, {
    code: code
  })
  return base.buildResponse(rs)
}

export default loginByCode
