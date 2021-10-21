const { env } = require('../config');
const { ApiError } = require('../lib/ApiError');
const BaseApi = require('./BaseApi');

class HahowApi extends BaseApi {
  /**
   * Construct HahowApi
   * @param {string} hahowApiUrl Hahow api url
   * @param {number} hahowApiTimeout Hahow api timeout (ms)
   */
  constructor (hahowApiUrl, hahowApiTimeout) {
    super(hahowApiUrl || env.HAHOW_API_URL, hahowApiTimeout || env.HAHOW_API_TIMEOUT);
  }

  /**
   * @typedef Hero
   * @type {object}
   * @property {string} id 英雄id
   * @property {string} name 英雄名字
   * @property {string} image 英雄圖片
   */
  /**
   * Single Hero - 取得單一英雄
   * @param {string} heroId 欲查詢英雄id
   * @returns {Promise<Hero> | never} 英雄
   */
  async SingleHero (heroId) {
    if (!heroId || typeof (heroId) !== 'string') throw new Error('heroId 不為 string');

    const response = await this.get('/heroes/' + heroId);
    if (response.status === 404) throw new ApiError('not_found', 'Not Found', 404);
    if (response.status !== 200) throw new Error('SingleHero 回傳status不為 200');
    if (!response.data) throw new Error('SingleHero 沒有回傳資料');
    if (typeof (response.data.id) !== 'string') throw new Error('SingleHero 回傳資料格式錯誤');

    return response.data;
  }

  /**
   * List Heroes - 取得英雄列表
   * @returns {Promise<Hero[]> | never} 英雄陣列
   */
  async ListHeroes () {
    const response = await this.get('/heroes');
    if (response.status !== 200) throw new Error('ListHeroes 回傳status不為 200');
    if (
      !Array.isArray(response.data)
      || response.data.some((v) => !v || typeof (v.id) !== 'string')
    ) throw new Error('ListHeroes 回傳資料格式錯誤');

    return response.data;
  }

  /**
   * @typedef HeroProfile
   * @type {object}
   * @property {number} str 力量屬性值
   * @property {number} int 智力屬性值
   * @property {number} agi 敏捷屬性值
   * @property {number} luk 幸運屬性值
   */
  /**
   * Profile of Hero - 取得英雄檔案
   * @param {string} heroId 欲查詢英雄id
   * @returns {Promise<HeroProfile> | never} 英雄檔案
   */
  async ProfileOfHero (heroId) {
    if (!heroId || typeof (heroId) !== 'string') throw new Error('heroId 不為 string');

    const response = await this.get('/heroes/' + heroId + '/profile');
    if (response.status === 404) throw new ApiError('not_found', 'Not Found', 404);
    if (response.status !== 200) throw new Error('ProfileOfHero 回傳status不為 200');
    if (!response.data) throw new Error('ProfileOfHero 沒有回傳資料');

    return response.data;
  }

  /**
   * Authenticate - 驗證使用者身分
   * @param {string} name 使用者名稱
   * @param {string} password 使用者密碼
   * @returns {Promise<void> | never} 當驗證失敗時，Throw error / 成功時，甚麼都不回傳
   */
  async Authenticate (name, password) {
    if (!name || typeof (name) !== 'string') throw new Error('name 不為 string');
    if (!password || typeof (password) !== 'string') throw new Error('password 不為 string');

    const response = await this.post('/auth', { name, password });
    if (response.status === 401) throw new ApiError('unauthorized', 'Unauthorized', 401);
    if (response.status !== 200) throw new Error('Authenticate 回傳status不為 200');
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
   * @param {Object} params 呼叫API的Params (path後面的 "?aaa=bbb&ccc=ddd")
   * @param {number} retryCnt 當出現 "Backend Error"時，剩餘重試次數 (default: 5)
   * @returns {Promise<ResponseType> | never} 呼叫API後，回傳的status及data
   */
  async get (path, params, retryCnt = 5) {
    const response = await this.callApi('get', path, params, null);
    if (response.data?.code === 1000) {
      // 當出現 "Backend Error"
      //  retryCnt > 0 => 重試
      //  retryCnt <= 0 => Throw error
      if (retryCnt <= 0) throw new Error('Backend Error');
      return this.get(path, params, retryCnt - 1);
    }

    return response;
  }

  /**
   * 呼叫API (POST)
   * @param {string} path 呼叫API的path
   * @param {Object} data Request Body
   * @param {number} retryCnt 當出現 "Backend Error"時，剩餘重試次數 (default: 5)
   * @returns {Promise<ResponseType> | never} 呼叫API後，回傳的status及data
   */
  async post (path, data, retryCnt = 5) {
    const response = await this.callApi('post', path, null, data);
    if (response.data?.code === 1000) {
      // 當出現 "Backend Error"
      //  retryCnt > 0 => 重試
      //  retryCnt <= 0 => Throw error
      if (retryCnt <= 0) throw new Error('Backend Error');
      return this.post(path, data, retryCnt - 1);
    }

    return response;
  }
}

module.exports = HahowApi;