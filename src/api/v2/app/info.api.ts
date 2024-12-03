//@ts-ignore
import { get } from '@/utils/request'
import base from '@/api/base'

const info = async (user_id: number, app_id: number) => {
  const rs = get(`${base.api_v2_url}/app/info`, {
    user_id: user_id,
    app_id: app_id,
  })
  return base.buildResponse(await rs)
}

export default info
