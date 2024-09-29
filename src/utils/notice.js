import api from '@/api'
import logger from '@/utils/logger'
import { sendErrorMessage } from '@/utils/message'
import { marked } from 'marked'

let notice = {
  getNotice: getNotice
}

// 通知 or AD
async function getNotice() {
  const time = new Date()
  const year = time.getFullYear()
  const month = time.getMonth()
  const day = time.getDate()
  const current = `${year}-${month}-${day}`
  // console.log('Rquest ads')
  let res
  try {
    res = await api.v2.notice.root.get()
  } catch (e) {
    logger.error(e)
    sendErrorMessage('获取 Notice 失败: ' + e)
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
