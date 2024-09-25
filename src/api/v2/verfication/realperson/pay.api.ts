import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const pay = async (username: string, notify_url: string, redirect_url: string) => {
  const rs = get(`${base.api_v2_url}/realperson/pay`, {
    username: username,
    notify_url: notify_url,
    redirect_url: redirect_url
  })
  return base.buildResponse(await rs)
}

export default pay
