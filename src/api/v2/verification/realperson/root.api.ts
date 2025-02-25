import base from '@/api/base'
//@ts-ignore
import { get, post, deleteReq } from '@/utils/request'

const getRealperson = async (user_id: number) => {
  const rs = get(`/verification/realperson`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

const postRealperson = async (user_id: number, name: string, id_card: string) => {
  const rs = post(`/verification/realperson`, {
    user_id: user_id,
    name: name,
    id_card: id_card
  })
  return base.buildResponse(await rs)
}

const deleteRealperson = async (user_id: number) => {
  const rs = deleteReq(`/verification/realperson`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

const realperson = {
  get: getRealperson,
  post: postRealperson,
  delete: deleteRealperson
}

export default realperson
