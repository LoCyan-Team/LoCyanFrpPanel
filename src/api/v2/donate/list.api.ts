import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 列出赞助列表
 */
const list = async (user_id: number) => {
  const rs = get(`/donate/list`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

export default list
