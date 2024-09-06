import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const update = async (
  proxy_id: number,
  proxy_name: string,
  proxy_type: string,
  username: string,
  local_ip: string,
  local_port: number,
  remote_port: number,
  domain: string,
  node_id: number
) => {
  const rs = post(`${base.api_v2_url}/proxies/update`, {
    id: proxy_id,
    proxyName: proxy_name,
    proxyType: proxy_type,
    username: username,
    localIp: local_ip,
    localPort: local_port,
    remotePort: remote_port,
    domain: domain,
    node: node_id
  })
  return base.buildResponse(await rs)
}

export default update
