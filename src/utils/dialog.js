export const sendSuccessDialog = (message) => {
  window.$dialog.success({
    title: '厉害捏！',
    content: message,
    positiveText: '收到'
  })
}

export const sendWarningDialog = (message) => {
  window.$dialog.warning({
    title: '这只是个警告罢了~',
    content: message,
    positiveText: '收到'
  })
}

export const sendErrorDialog = (message) => {
  window.$dialog.error({
    title: '发生了点小错误...',
    content: message,
    positiveText: '收到'
  })
}
