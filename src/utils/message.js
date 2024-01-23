export const sendSuccessMessage = (message) => {
  // 需要确保已经在 setup 中执行了 window.$message = message
  window.$message.success(message)
}

export const sendWarningMessage = (message) => {
  // 需要确保已经在 setup 中执行了 window.$message = message
  window.$message.warning(message)
}

export const sendErrorMessage = (message) => {
  // 需要确保已经在 setup 中执行了 window.$message = message
  window.$message.error(message)
}
