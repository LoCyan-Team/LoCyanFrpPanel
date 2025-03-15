import base from '@/api/base'
import { post, deleteReq } from '@/utils/request'

import Update from '@/api/v2/proxy/update.api.ts'
import All from '@/api/v2/proxy/all.api.ts'
import Down from '@/api/v2/proxy/down.api.ts'
import Config from '@/api/v2/proxy/config.api.ts'

export default class Proxy {
  public update = new Update()
  public all = new All()
  public down = new Down()
  public config = new Config()

  async post(params: {
    userId: number
    name: string
    localIp: string
    type: string
    localPort: number
    remotePort: number
    nodeId: number
    useEncryption: boolean
    useCompression: boolean
    secretKey: string
    domain: string
  }) {
    const rs = await post(`/proxy`, {
      user_id: params.userId,
      name: params.name,
      local_ip: params.localIp,
      type: params.type,
      local_port: params.localPort,
      remote_port: params.remotePort,
      node_id: params.nodeId,
      use_encryption: params.useEncryption,
      use_compression: params.useCompression,
      secret_key: params.secretKey,
      domain: params.domain
    })
    return base.buildResponse(rs)
  }

  async delete(params: { userId: number; proxyId: number }) {
    const rs = await deleteReq(`/proxy`, {
      user_id: params.userId,
      proxy_id: params.proxyId
    })
    return base.buildResponse(rs)
  }
}
