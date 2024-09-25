//@ts-ignore
import { get, deleteReq } from '@/utils/request'
import base from '@/api/base'

const getToken = async (username: string) => {
  const rs = get(`${base.api_v2_url}/user/token`, {
    username: username
  })
  return base.buildResponse(await rs)
}

const deleteToken = async (username: string) => {
    const rs = deleteReq(`${base.api_v2_url}/user/token`, {
        username: username
    })
    return base.buildResponse(await rs)
}

const token = {
    get: getToken,
    delete: deleteToken
}

export default token
