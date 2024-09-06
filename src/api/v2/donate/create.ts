import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

/**
 * 创建赞助订单
 */
const create = async (
  username: string,
  name: string,
  money: string,
  redirect_url: string,
  notify_url: string
) => {
  const rs = post(`${base.api_v2_url}/donate/create`, {
    username: username,
    name: name,
    money: money,
    redirect_url: redirect_url,
    notify_url: notify_url
  })
  return base.buildResponse(await rs)
}

export default create
