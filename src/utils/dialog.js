class Dialog {
  success(
    message,
    options = {
      onPositiveClick: null,
      onNegativeClick: null,
      onMaskClick: null
    }
  ) {
    window.$dialog.success({
      title: '厉害捏！',
      content: message,
      positiveText: '收到',
      negativeText: '不要',
      onPositiveClick: options.onPositiveClick,
      onNegativeClick: options.onNegativeClick,
      onMaskClick: options.onMaskClick
    })
  }
  warning(
    message,
    options = {
      onPositiveClick: null,
      onNegativeClick: null,
      onMaskClick: null
    }
  ) {
    window.$dialog.warning({
      title: '这只是个警告罢了~',
      content: message,
      positiveText: '收到',
      negativeText: '不要',
      onPositiveClick: options.onPositiveClick,
      onNegativeClick: options.onNegativeClick,
      onMaskClick: options.onMaskClick
    })
  }
  error(
    message,
    options = {
      onPositiveClick: null,
      onNegativeClick: null,
      onMaskClick: null
    }
  ) {
    window.$dialog.error({
      title: '发生了点小错误...',
      content: message,
      positiveText: '收到',
      negativeText: '不要',
      onPositiveClick: options.onPositiveClick,
      onNegativeClick: options.onNegativeClick,
      onMaskClick: options.onMaskClick
    })
  }
}

export default Dialog
