export const StartLoadingBar = () => {
  window.$loadingBar.start();
};

export const FinishLoadingBar = () => {
  window.$loadingBar.finish();
};

export const ErrorLoadingBar = () => {
  window.$loadingBar.error();
};
