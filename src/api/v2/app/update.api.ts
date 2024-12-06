//@ts-ignore
import { post } from '@/utils/request'
import base from '@/api/base'

const update = async (
  user_id: number,
  app_id: number,
  app_name: string,
  app_description: string | null,
  redirect_url: string | null
) => {
  const rs = post(`${base.api_v2_url}/app/update`, {
    user_id: user_id,
    app_id: app_id,
    app_name: app_name,
    app_description: app_description,
    redirect_url: redirect_url
  })
  return base.buildResponse(await rs)
}

export default update
