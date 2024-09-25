import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 获取单个隧道配置文件
 */
const config = async (proxy_id: number) => {
  const rs = get(`${base.api_v2_url}/proxy/config`, {
    proxy_id: proxy_id
  })
  return base.buildResponse(await rs)
}

export default config
