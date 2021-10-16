// 環境變數
const env = {
  // 回傳錯誤時，是否回傳 error stack
  LOG_ERROR_STACK: process.env.LOG_ERROR_STACK || '0',
  // Server listen port
  PORT: process.env.PORT || '3100',
  // Hahow api url
  HAHOW_API_URL: process.env.HAHOW_API_URL || 'https://hahow-recruit.herokuapp.com',
  // Hahow api timeout (ms)
  HAHOW_API_TIMEOUT: parseInt(process.env.HAHOW_API_TIMEOUT, 10) || 10000,
};
Object.freeze(env);

exports.env = env;