import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const list = async () => {
  const rs = get(`${base.api_v2_url}/nodes/list`, {})
  return base.buildResponse(await rs, false)
}

export default list
