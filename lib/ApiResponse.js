class ApiResponse {
  /**
   * Construct ApiResponse (放在res.apiResponse)
   * @param {number} status 回傳status
   * @param {Object} data 回傳JSON結果
   */
  constructor (status, data) {
    this.status = status || 200;
    this.data = data || {};
  }
}

module.exports = ApiResponse;