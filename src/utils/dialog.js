export const SendSuccessDialog = (message) => {
  window.$dialog.success({
    title: '厉害捏！',
    content: message,
    positiveText: '收到'
  })
}

export const SendWarningDialog = (message) => {
  window.$dialog.warning({
    title: '这只是个警告罢了~',
    content: message,
    positiveText: '收到'
  })
}

export const SendErrorDialog = (message) => {
  window.$dialog.error({
    title: '发生了点小错误...',
    content: message,
    positiveText: '收到'
  })
}
