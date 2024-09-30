import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const all = async () => {
  const rs = get(`${base.api_v2_url}/node/all`, {})
  return base.buildResponse(await rs)
}

export default all
