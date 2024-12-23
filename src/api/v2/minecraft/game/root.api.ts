import base from '@/api/base'
//@ts-ignore
import { post, deleteReq } from '@/utils/request'

const postGame = async (user_id: number, proxy_id: number) => {
  const rs = await post(`${base.api_v2_url}/minecraft/game`, {
    user_id: user_id,
    proxy_id: proxy_id
  })
  return base.buildResponse(await rs)
}

const deleteGame = async (user_id: number, code: number) => {
  const rs = await deleteReq(`${base.api_v2_url}/minecraft/game`, {
    user_id: user_id,
    code: code
  })
  return base.buildResponse(await rs)
}

const root = {
  post: postGame,
  delete: deleteGame
}

export default root
