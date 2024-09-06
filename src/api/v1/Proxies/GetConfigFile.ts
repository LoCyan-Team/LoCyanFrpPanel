import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const GetConfigFile = async (username: string, token: string, node_id: number) => {
  const rs = get(`${base.api_v1_url}/Proxies/GetConfigFile`, {
    username: username,
    token: token,
    node: node_id
  })
  return base.buildResponse(await rs, false)
}

export default GetConfigFile
