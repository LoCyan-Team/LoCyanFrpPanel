import base from '@/api/base'
//@ts-ignore
import { get, post } from '@/utils/request'

const captcha = async (action: string) => {
  const rs = get(`${base.api_v2_url}/captcha`, {
    action: action
  })
  return base.buildResponse(await rs)
}

export default captcha
