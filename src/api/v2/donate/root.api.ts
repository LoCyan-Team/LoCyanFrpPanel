import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

/**
 * 创建赞助订单
 */
const postDonate = async (user_id: number, money: string) => {
  const rs = post(`/donate`, {
    user_id: user_id,
    money: money
  })
  return base.buildResponse(await rs)
}

const root = {
  post: postDonate
}

export default root
