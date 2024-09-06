import logger from '@/utils/logger'

// 在当前js全局化
let ws

export function init_ws() {
  if ('WebSocket' in window) {
    logger.info('您的浏览器支持 WebSocket!')
    ws = new WebSocket(`wss://ws.api.locyanfrp.cn/api`)
    ws.onopen = function () {
      logger.info('webSocket connect successful')
    }
    ws.onclose = function () {
      // 关闭 websocket
      logger.warn('webSocket connect closed')
      setTimeout(() => {
        init_ws()
      }, 2000)
    }
  } else {
    // 浏览器不支持 WebSocket
    logger.error('您的浏览器不支持 WebSocket!')
  }
}

export function SetOnMessageFunction(handle_function) {
  ws.onmessage = handle_function
  logger.info('成功设置回调函数')
}
