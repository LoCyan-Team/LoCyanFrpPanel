// 2024-09-06 Muska_Ami: 他妈的 为什么要再造轮子啊
export default class Message {
  success(message: any, options = {}) {
    window.$message.success(message, options)
  }
  warning(message: any, options = {}) {
    window.$message.warning(message, options)
  }
  error(message: any, options = {}) {
    window.$message.error(message, options)
  }
}
