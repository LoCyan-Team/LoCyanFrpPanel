import Content from './content.api'

import base from '@/api/base'
import { get } from '@/utils/request'

export default class Notice {
  public content = new Content()

  /**
   * 获取通知列表
   */
  async get() {
    const rs = await get(`/notice`)
    return base.buildResponse(rs)
  }
}
