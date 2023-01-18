export const SendSuccessMessage = (message) => {
    // 需要确保已经在 setup 中执行了 window.$message = message
    window.$message.success(message)
};

export const SendWarningMessage = (message) => {
    // 需要确保已经在 setup 中执行了 window.$message = message
    window.$message.warning(message)
};

export const SendErrorMessage = (message) => {
    // 需要确保已经在 setup 中执行了 window.$message = message
    window.$message.error(message)
};