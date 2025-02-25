//@ts-ignore
import { deleteReq } from '@/utils/request'
import base from '@/api/base'

const session = async (user_id: number, app_id: number, session_id: number | undefined) => {
  const rs = deleteReq(`/auth/oauth/authorized/session`, {
    user_id: user_id,
    app_id: app_id,
    session_id: session_id
  })
  return base.buildResponse(await rs)
}

export default session
