import base from '@/api/base'
//@ts-ignore
import { post, deleteReq } from '@/utils/request'

const postProxy = async (
  user_id: number,
  name: string,
  local_ip: string,
  type: string,
  local_port: number,
  remote_port: number,
  node_id: number,
  use_encryption: boolean,
  use_compression: boolean,
  secret_key: string,
  domain: string
) => {
  const rs = post(`/proxy`, {
    user_id: user_id,
    name: name,
    local_ip: local_ip,
    type: type,
    local_port: local_port,
    remote_port: remote_port,
    node_id: node_id,
    use_encryption: use_encryption,
    use_compression: use_compression,
    secret_key: secret_key,
    domain: domain
  })
  return base.buildResponse(await rs)
}

const deleteProxy = async (user_id: number, proxy_id: number) => {
  const rs = deleteReq(`/proxy`, {
    user_id: user_id,
    proxy_id: proxy_id
  })
  return base.buildResponse(await rs)
}

const proxy = {
  post: postProxy,
  delete: deleteProxy
}

export default proxy
