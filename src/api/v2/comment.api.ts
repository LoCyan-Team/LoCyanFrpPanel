import base from '@/api/base'
//@ts-ignore
import { get, post } from '@/utils/request'

/**
 * 获取评论列表
 */
const getCommentList = async (user_id: number) => {
  const rs = get(`/comment`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

/**
 * 添加评论
 */
const postComment = async (user_id: number, comment: string) => {
  const rs = post(`/comment`, {
    user_id: user_id,
    comment: comment
  })
  return base.buildResponse(await rs)
}

const comment = {
  get: getCommentList,
  post: postComment
}

export default comment
