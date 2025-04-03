import base from '@/api/base'
//@ts-ignore
import { get, post, deleteReq } from '@/utils/request'

/**
 * 审核 ICP 备案域名
 */
const postIcp = async (user_id: number, domain: string) => {
  const rs = post(`${base.api_v2_url}/icp`, {
    user_id: user_id,
    domain: domain
  })
  return base.buildResponse(await rs)
}

const deleteIcp = async (user_id: number, domain_id: number) => {
  const rs = deleteReq(`${base.api_v2_url}/icp`, {
    user_id: user_id,
    id: domain_id
  })
  return base.buildResponse(await rs)
}

/**
 * 列出已审核 ICP 备案域名
 */
const getIcp = async (user_id: number) => {
  const rs = get(`${base.api_v2_url}/icp`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

const root = {
    postIcp: postIcp,
    deleteIcp: deleteIcp,
    getIcp: getIcp
}

export default root