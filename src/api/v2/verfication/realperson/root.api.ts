import base from '@/api/base'
//@ts-ignore
import { get, post } from '@/utils/request'

const postRealperson = async (username: string, name: string, id_card: string) => {
  const rs = post(`${base.api_v2_url}/realperson`, {
    username: username,
    name: name,
    id_card: id_card
  })
  return base.buildResponse(await rs)
}

const getRealperson = async (username: string) => {
  const rs = get(`${base.api_v2_url}/realperson`, {
    username: username
  })
  return base.buildResponse(await rs)
}

const realname = {
  get: getRealperson,
  post: postRealperson
}

export default realname
