export default class Notification {
  info(title: string, message: string) {
    window.$notification['info']({
      content: title,
      meta: message,
      duration: 2500,
      keepAliveOnHover: true
    })
  }
  success(title: string, message: string) {
    window.$notification['success']({
      content: title,
      meta: message,
      duration: 2500,
      keepAliveOnHover: true
    })
  }
  warning(title: string, message: string) {
    window.$notification['warning']({
      content: title,
      meta: message,
      duration: 2500,
      keepAliveOnHover: true
    })
  }
  error(title: string, message: string) {
    window.$notification['error']({
      content: title,
      meta: message,
      duration: 2500,
      keepAliveOnHover: true
    })
  }
}
