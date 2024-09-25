import base from '@/api/base'
//@ts-ignore
import { get, post, deleteReq } from '@/utils/request'

/**
 * 审核 ICP 备案域名
 */
const postIcp = async (username: string, token: string, domain: string) => {
  const rs = post(`${base.api_v2_url}/icp`, {
    username: username,
    token: token,
    domain: domain
  })
  return base.buildResponse(await rs)
}

const deleteIcp = async (username: string, token: string, domain_id: number) => {
  const rs = deleteReq(`${base.api_v2_url}/icp`, {
    username: username,
    token: token,
    id: domain_id
  })
  return base.buildResponse(await rs)
}

/**
 * 列出已审核 ICP 备案域名
 */
const getIcp = async (username: string, token: string) => {
  const rs = get(`${base.api_v2_url}/icp`, {
    username: username,
    token: token
  })
  return base.buildResponse(await rs)
}

const icp = {
  get: getIcp,
  post: postIcp,
  delete: deleteIcp
}

export default icp
