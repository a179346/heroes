const DEFAULT_MESSAGE = 'Internal Server Error';
const DEFAULT_CODE = 'internal_server_error';
const DEFAULT_STATUS = 500;

class ApiError extends Error {
  /**
   * Construct ApiError
   * @param {string} code 錯誤代碼
   * @param {string} message 錯誤訊息
   * @param {number} status 錯誤回傳status
   */
  constructor (code, message, status) {
    super(message || DEFAULT_MESSAGE);
    this.code = code || DEFAULT_CODE;
    this.status = status || DEFAULT_STATUS;
  }
}

exports.ApiError = ApiError;
exports.DEFAULT_MESSAGE = DEFAULT_MESSAGE;
exports.DEFAULT_CODE = DEFAULT_CODE;
exports.DEFAULT_STATUS = DEFAULT_STATUS;