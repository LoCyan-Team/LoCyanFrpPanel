import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const update = async (
  user_id: number,
  proxy_id: number,
  proxy_name: string,
  proxy_type: string,
  local_ip: string,
  local_port: number,
  remote_port: number,
  use_encryption: boolean,
  use_compression: boolean,
  node_id: number,
  domain: string,
  secret_key: string
) => {
  const rs = post(`/proxy/update`, {
    user_id: user_id,
    proxy_id: proxy_id,
    proxy_type: proxy_type,
    proxy_name: proxy_name,
    local_ip: local_ip,
    local_port: local_port,
    remote_port: remote_port,
    use_encryption: use_encryption,
    use_compression: use_compression,
    node_id: node_id,
    domain: domain,
    secret_key: secret_key
  })
  return base.buildResponse(await rs)
}

export default update
