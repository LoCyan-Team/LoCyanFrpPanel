//@ts-ignore
import { get } from '@/utils/request'
import base from '@/api/base'

const info = async (user_id: number, app_id: number) => {
  const rs = get(`/app/info`, {
    user_id: user_id,
    app_id: app_id
  })
  return base.buildResponse(await rs)
}

export default info
