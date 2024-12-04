// 2024-09-06 Muska_Ami: 他妈的 为什么要再造轮子啊
class Message {
  success(message, options = {}) {
    window.$message.success(message, options)
  }
  warning(message, options = {}) {
    window.$message.warning(message, options)
  }
  error(message, options = {}) {
    window.$message.error(message, options)
  }
}

export default Message
