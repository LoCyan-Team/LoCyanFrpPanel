class Notification {
  info(title, message) {
    window.$notification['info']({
      content: title,
      meta: message,
      duration: 2500,
      keepAliveOnHover: true
    })
  }
  success(title, message) {
    window.$notification['success']({
      content: title,
      meta: message,
      duration: 2500,
      keepAliveOnHover: true
    })
  }
  warning(title, message) {
    window.$notification['warning']({
      content: title,
      meta: message,
      duration: 2500,
      keepAliveOnHover: true
    })
  }
  error(title, message) {
    window.$notification['error']({
      content: title,
      meta: message,
      duration: 2500,
      keepAliveOnHover: true
    })
  }
}

export default Notification
