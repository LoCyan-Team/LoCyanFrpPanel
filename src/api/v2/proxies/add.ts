import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const add = async (
  username: string,
  name: string,
  frp_token: string,
  local_ip: string,
  type: string,
  local_port: number,
  remote_port: number,
  ue: string,
  uz: string,
  node_id: number,
  token: string,
  domain: string,
  sk: string
) => {
  const rs = post(`${base.api_v2_url}/proxies/add`, {
    username: username,
    name: name,
    key: frp_token,
    ip: local_ip,
    type: type,
    lp: local_port,
    rp: remote_port,
    ue: ue,
    uz: uz,
    id: node_id,
    token: token,
    url: domain,
    sk: sk
  })
  return base.buildResponse(await rs)
}

export default add
