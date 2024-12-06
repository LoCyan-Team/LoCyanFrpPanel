import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const all = async (user_id: number | undefined) => {
  const rs = get(
    `${base.api_v2_url}/donate/say/all`,
    user_id
      ? {
          user_id: user_id
        }
      : null
  )
  return base.buildResponse(await rs)
}

export default all
