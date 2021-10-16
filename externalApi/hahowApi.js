const axios = require('axios');

const { env } = require('../config');

class HahowApi {
  /**
   * Construct HahowApi
   * @param {string} hahowApiUrl Hahow api url
   * @param {number} hahowApiTimeout Hahow api timeout (ms)
   */
  constructor (hahowApiUrl, hahowApiTimeout) {
    this.hahowApiUrl = hahowApiUrl || env.HAHOW_API_URL;
    this.hahowApiTimeout = hahowApiTimeout || env.HAHOW_API_TIMEOUT;

    // 紀錄呼叫外部API的 "request", "response", "errorStack" 跟 "diffms"
    // 當每次呼叫外部API時，會push進去，可用來記錄log方便查詢 (存在req.HahowApi.apiLogs)
    this.apiLogs = [];
  }

  /**
   * @typedef Hero
   * @type {object}
   * @property {string} id 英雄id
   * @property {string} name 英雄名字
   * @property {string} image 英雄圖片
   */
  /**
   * List Heroes - 取得英雄列表
   * @returns {Promise<Hero[]> | never} 英雄陣列
   */
  async ListHeroes () {
    const response = await this.get('/heroes');
    if (response.status !== 200) throw new Error('ListHeroes 回傳status不為 200');
    if (!Array.isArray(response.data) || response.data.some((v) => !v || !v.id)) throw new Error('ListHeroes 回傳資料格式錯誤');

    return response.data;
  }

  /**
   * @typedef ResponseType
   * @type {object}
   * @property {number} status 呼叫API，得到的status
   * @property {Object} data 呼叫API，回傳資料結構
   */
  /**
   * 呼叫API (GET)
   * @param {string} path 呼叫API的path
   * @param {Object} params Get Params
   * @returns {Promise<ResponseType> | never} 呼叫API後，回傳的status及data
   */
  async get (path, params) {
    // 準備要push進 apiLogs 的資料
    const log = {
      // request資訊
      request: {
        url: path,
        method: 'get',
        baseURL: this.hahowApiUrl,
        params: params || {},
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
        method: 'get',
        baseURL: this.hahowApiUrl,
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json'
        },
        params: params || {},
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
        timeout: this.hahowApiTimeout,
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

module.exports = HahowApi;