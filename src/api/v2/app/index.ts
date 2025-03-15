import Info from './info.api'
import Update from './update.api'
import All from './all.api'

import base from '@/api/base'
import { post, deleteReq } from '@/utils/request'

export default class App {
  public info = new Info()
  public update = new Update()
  public all = new All()

  /**
   * 创建应用
   */
  async post(params: {
    userId: number
    appName: string
    appDescription: string | undefined
    redirectUrl: string
  }) {
    const rs = post(`/app`, {
      user_id: params.userId,
      app_name: params.appName,
      app_description: params.appDescription,
      redirect_url: params.redirectUrl
    })
    return base.buildResponse(await rs)
  }

  /**
   * 删除应用
   */
  async delete(params: { userId: number; appId: number }) {
    const rs = deleteReq(`/app`, {
      user_id: params.userId,
      app_id: params.appId
    })
    return base.buildResponse(await rs)
  }
}
