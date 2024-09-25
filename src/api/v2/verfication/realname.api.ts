import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const realname = async (username: string, name: string, id_card: string) => {
  const rs = post(`${base.api_v2_url}/realname`, {
    username: username,
    name: name,
    id_card: id_card
  })
  return base.buildResponse(await rs)
}

export default realname
