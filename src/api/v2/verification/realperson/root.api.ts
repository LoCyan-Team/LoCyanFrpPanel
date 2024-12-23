import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const postRealperson = async (user_id: number, name: string, id_card: string) => {
  const rs = post(`${base.api_v2_url}/verification/realperson`, {
    user_id: user_id,
    name: name,
    id_card: id_card
  })
  return base.buildResponse(await rs)
}

const realperson = {
  post: postRealperson
}

export default realperson
