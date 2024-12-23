import base from '@/api/base'
//@ts-ignore
import { post, deleteReq } from '@/utils/request'

const postApp = async (
  user_id: number,
  app_name: string,
  app_description: string | null,
  redirect_url: string
) => {
  const rs = post(`${base.api_v2_url}/app`, {
    user_id: user_id,
    app_name: app_name,
    app_description: app_description,
    redirect_url: redirect_url
  })
  return base.buildResponse(await rs)
}

const deleteApp = async (user_id: number, app_id: number) => {
  const rs = deleteReq(`${base.api_v2_url}/app`, {
    user_id: user_id,
    app_id: app_id
  })
  return base.buildResponse(await rs)
}

const root = {
  post: postApp,
  delete: deleteApp
}

export default root
