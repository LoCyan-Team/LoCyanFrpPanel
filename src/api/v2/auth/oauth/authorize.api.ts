//@ts-ignore
import { post } from '@/utils/request'
import base from '@/api/base'

const authorize = async (
  user_id: number,
  app_id: number,
  redirect_url: string,
  request_permission_ids: Array<number>
) => {
  const rs = post(`/auth/oauth/authorize`, {
    user_id: user_id,
    app_id: app_id,
    redirect_url: redirect_url,
    request_permission_ids: request_permission_ids
  })
  return base.buildResponse(await rs)
}

export default authorize
