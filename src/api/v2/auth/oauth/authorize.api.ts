//@ts-ignore
import { post } from '@/utils/request'
import base from '@/api/base'

const authorize = async (
  user_id: number,
  app_id: number,
  request_permission_ids: Array<number>,
) => {
  const rs = post(`${base.api_v2_url}/auth/oauth/authorize`, {
    user_id: user_id,
    app_id: app_id,
    request_permission_ids: request_permission_ids
  })
  return base.buildResponse(await rs)
}

export default authorize
