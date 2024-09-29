import base from '@/api/base'
//@ts-ignore
import { post, deleteReq } from '@/utils/request'

const postGame = async (username: string, proxy_id: number) => {
  const rs = await post(`${base.api_v2_url}/minecraft/game`, {
    username: username,
    proxy_id: proxy_id
  })
  return base.buildResponse(await rs)
}

const deleteGame = async (username: string, code: number) => {
  const rs = await deleteReq(`${base.api_v2_url}/minecraft/game`, {
    username: username,
    code: code
  })
  return base.buildResponse(await rs)
}

const root = {
  post: postGame,
  delete: deleteGame
}

export default root
