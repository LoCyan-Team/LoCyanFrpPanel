import base from '@/api/base'
//@ts-ignore
import { get, post, deleteReq } from '@/utils/request'

/**
 * 审核 ICP 备案域名
 */
const postIcp = async (user_id: number, domain: string) => {
  const rs = post(`/icp`, {
    user_id: user_id,
    domain: domain
  })
  return base.buildResponse(await rs)
}

const deleteIcp = async (user_id: number, domain_id: number) => {
  const rs = deleteReq(`/icp`, {
    user_id: user_id,
    id: domain_id
  })
  return base.buildResponse(await rs)
}

/**
 * 列出已审核 ICP 备案域名
 */
const getIcp = async (user_id: number) => {
  const rs = get(`/icp`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

const icp = {
  get: getIcp,
  post: postIcp,
  delete: deleteIcp
}

export default icp
