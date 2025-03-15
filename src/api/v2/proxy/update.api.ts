import base from '@/api/base'
import { post } from '@/utils/request'

export default class Update {
  async post(params: {
    userId: number
    proxyId: number
    proxyName: string
    proxyType: string
    localIp: string
    localPort: number
    remotePort: number
    useEncryption: boolean
    useCompression: boolean
    nodeId: number
    domain: string
    secretKey: string
  }) {
    const rs = await post(`/proxy/update`, {
      user_id: params.userId,
      proxy_id: params.proxyId,
      proxy_name: params.proxyName,
      proxy_type: params.proxyType,
      local_ip: params.localIp,
      local_port: params.localPort,
      remote_port: params.remotePort,
      use_encryption: params.useEncryption,
      use_compression: params.useCompression,
      node_id: params.nodeId,
      domain: params.domain,
      secret_key: params.secretKey
    })
    return base.buildResponse(rs)
  }
}
