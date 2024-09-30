import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 获取单个隧道配置文件
 */
const config = async (username: string, proxy_id: number, node_id: number) => {
  const rs = get(`${base.api_v2_url}/proxy/config`, {
    username: username,
    proxy_id: proxy_id,
    node_id: node_id
  })
  return base.buildResponse(await rs)
}

export default config
