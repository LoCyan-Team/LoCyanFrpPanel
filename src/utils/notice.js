import API from '@/api'
import logger from '@/utils/logger'
import Message from '@/utils/message'
import { marked } from 'marked'

const api = new API()
const message = new Message()

let notice = {
  getNotice: getNotice
}

// 通知 or AD
async function getNotice() {
  let res
  try {
    res = await api.v2.notice.get()
  } catch (e) {
    logger.error(e)
    message.error('获取 Notice 失败: ' + e)
  }
  // console.log(res)
  if (!res) return
  let announcement
  let broadcast
  if (res.status === 200) {
    announcement = marked(res.data.announcement)
    // 公告
    broadcast = marked(res.data.broadcast)
  } else {
    announcement = '获取通知失败'
    broadcast = '获取公告失败'
  }
  return {
    announcement: announcement,
    broadcast: broadcast
  }
}

export default notice
