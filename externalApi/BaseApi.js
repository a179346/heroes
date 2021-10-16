const axios = require('axios');

class BaseApi {
  /**
   * Construct BaseApi
   * @param {string} baseUrl Api server base url
   * @param {number} timeout api call timeout 時間設定 (ms)
   */
  constructor (baseUrl, timeout) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    // apiLogs 紀錄呼叫外部API的 "request", "response", "errorStack" 跟 "diffms"
    // 當每次呼叫外部API時，會push進去，可用來記錄log方便查詢 (存在req.HahowApi.apiLogs)
    this.apiLogs = [];
  }

  /**
   * @typedef ResponseType
   * @type {object}
   * @property {number} status 呼叫API，得到的status
   * @property {Object} data 呼叫API，回傳資料結構
   */
  /**
   * 呼叫API
   * @param {string} method POST / GET / PUT / PATCH / DELETE ...
   * @param {string} path 呼叫API的path
   * @param {Object} params 呼叫API的Params (path後面的 "?aaa=bbb&ccc=ddd")
   * @param {Object} data Request Body
   * @returns {Promise<ResponseType> | never} 呼叫API後，回傳的status及data
   */
  async callApi (method, path, params, data) {
    // 準備要push進 apiLogs 的資料
    const log = {
      // request資訊
      request: {
        url: path,
        method,
        baseURL: this.baseUrl,
        params: params || {},
        data: data || {},
      },
      // response資訊
      response: null,
      // 錯誤資訊
      errorStack: null,
      // 呼叫API用時
      diffms: 0
    };
    const startTimestamp = Date.now();

    try {
      // 呼叫API
      const response = await axios({
        url: path,
        method,
        baseURL: this.baseUrl,
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json'
        },
        params: params || {},
        data: data || {},
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
        timeout: this.timeout,
      });

      // 整理reponse存到 apiLogs
      log.response = {
        status: response.status,
        data: response.data
      };
      log.diffms = Date.now() - startTimestamp;
      this.apiLogs.push(log);

      return log.response;
    } catch (error) {
      // 整理error存到 apiLogs
      log.errorStack = error.stack;
      log.diffms = Date.now() - startTimestamp;
      this.apiLogs.push(log);

      throw error;
    }
  }
}

module.exports = BaseApi;