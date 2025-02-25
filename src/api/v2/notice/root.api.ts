import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const getNotice = async () => {
  const rs = get(`/notice`)
  return base.buildResponse(await rs)
}

const notice = {
  get: getNotice
}

export default notice
