import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const getNotice = async () => {
  const rs = get(`${base.api_v2_url}/notice`)
  return base.buildResponse(await rs)
}

const notice = {
  get: getNotice
}

export default notice
