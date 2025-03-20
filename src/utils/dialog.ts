export default class Dialog {
  success(
    message: string,
    options: {
      onPositiveClick: Promise<void> | undefined
      onNegativeClick: Promise<void> | undefined
      onMaskClick: Promise<void> | undefined
    } = {
      onPositiveClick: undefined,
      onNegativeClick: undefined,
      onMaskClick: undefined
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
    message: string,
    options: {
      onPositiveClick: Promise<void> | undefined
      onNegativeClick: Promise<void> | undefined
      onMaskClick: Promise<void> | undefined
    } = {
      onPositiveClick: undefined,
      onNegativeClick: undefined,
      onMaskClick: undefined
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
    message: string,
    options: {
      onPositiveClick: Promise<void> | undefined
      onNegativeClick: Promise<void> | undefined
      onMaskClick: Promise<void> | undefined
    } = {
      onPositiveClick: undefined,
      onNegativeClick: undefined,
      onMaskClick: undefined
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
