import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

/**
 * 列出赞助列表
 */
const postSay = async (user_id: number, trade_no: string, message: string) => {
  const rs = post(`/donate/say`, {
    user_id: user_id,
    trade_no: trade_no,
    message: message
  })
  return base.buildResponse(await rs)
}

const root = {
  post: postSay
}

export default root
