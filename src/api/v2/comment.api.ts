import base from '@/api/base'
//@ts-ignore
import { get, post } from '@/utils/request'

export default class Comment {
  /**
   * 获取评论列表
   */
  async get(params: { userId: number }) {
    const rs = await get(`/comment`, {
      user_id: params.userId
    })
    return base.buildResponse(rs)
  }

  /**
   * 添加评论
   */
  async post(params: { userId: number; comment: string }) {
    const rs = await post('/comment', {
      user_id: params.userId,
      comment: params.comment
    })
    return base.buildResponse(rs)
  }
}
