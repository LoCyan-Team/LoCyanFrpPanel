import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

/**
 * 创建赞助订单
 */
const postDonate = async (username: string, money: string) => {
  const rs = post(`${base.api_v2_url}/donate`, {
    username: username,
    money: money
  })
  return base.buildResponse(await rs)
}

const root = {
  post: postDonate
}

export default root
