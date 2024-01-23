export const sendSuccessNotification = (message) => {
  window.notification['success']({
    content: '成功',
    meta: message,
    duration: 2500,
    keepAliveOnHover: true
  })
}
export const sendWarningNotification = (message) => {
  window.notification['warning']({
    content: '警告',
    meta: message,
    duration: 2500,
    keepAliveOnHover: true
  })
}
export const sendErrorNotification = (message) => {
  window.notification['error']({
    content: '错误',
    meta: message,
    duration: 2500,
    keepAliveOnHover: true
  })
}
export const sendInfoNotification = (message) => {
  window.notification['info']({
    content: '信息',
    meta: message,
    duration: 2500,
    keepAliveOnHover: true
  })
}
