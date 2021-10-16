// 環境變數
const env = {
  // 回傳錯誤時，是否回傳 error stack
  LOG_ERROR_STACK: process.env.LOG_ERROR_STACK || '0',
  // Server listen port
  PORT: process.env.PORT || '3100',
};
Object.freeze(env);

exports.env = env;