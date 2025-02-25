//@ts-ignore
import { deleteReq } from '@/utils/request'
import base from '@/api/base'

const app = async (user_id: number, app_id: number | undefined) => {
  const rs = deleteReq(`/auth/oauth/authorized/app`, {
    user_id: user_id,
    app_id: app_id
  })
  return base.buildResponse(await rs)
}

export default app
