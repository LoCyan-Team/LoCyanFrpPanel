import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const all = async (username: string | undefined) => {
  const rs = get(
    `${base.api_v2_url}/donate/say/all`,
    username
      ? {
          username: username
        }
      : null
  )
  return base.buildResponse(await rs)
}

export default all
