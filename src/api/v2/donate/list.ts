import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 列出赞助列表
 * 目前没法用
 */
const list = async (username: number) => {
  const rs = get(`${base.api_v2_url}/donate/list`, {
    username: username
  })
  return base.buildResponse(await rs)
}

export default list
