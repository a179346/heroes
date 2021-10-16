const chai = require('chai');
const nock = require('nock');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const HahowApi = require('../../externalApi/hahowApi');
const { ApiError } = require('../../lib/ApiError');

const mockHahowApiUrl = 'http://HahowApiUrl.test';
const mockHahowApiTimeout = 300;
const hahowApi = new HahowApi(mockHahowApiUrl, mockHahowApiTimeout);

describe('Unit test - HahowApi.ProfileOfHero', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('ProfileOfHero 成功測試', () => {
    it('成功時應回傳英雄檔案', async () => {
      const mockResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      nock(mockHahowApiUrl)
        .get('/heroes/1/profile')
        .reply(200, mockResponse);

      const data = await hahowApi.ProfileOfHero('1');
      expect(data).to.deep.equal(mockResponse, 'hahowApi.ProfileOfHero 成功時回傳data應與mockResponse相同');
    });

    it('Backend Error 5 次後成功 => 應成功', async () => {
      const mockBackendError = { 'code':1000, 'message':'Backend error' };
      const mockResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      nock(mockHahowApiUrl)
        .get('/heroes/1/profile')
        .reply(200, mockBackendError)
        .get('/heroes/1/profile')
        .reply(200, mockBackendError)
        .get('/heroes/1/profile')
        .reply(200, mockBackendError)
        .get('/heroes/1/profile')
        .reply(200, mockBackendError)
        .get('/heroes/1/profile')
        .reply(200, mockBackendError)
        .get('/heroes/1/profile')
        .reply(200, mockResponse);

      const data = await hahowApi.ProfileOfHero('1');
      expect(data).to.deep.equal(mockResponse, 'hahowApi.ProfileOfHero 成功時回傳data應與mockResponse相同');
    });

    it('delay 30 ms => 應成功回傳英雄檔案', async () => {
      const mockResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      nock(mockHahowApiUrl)
        .get('/heroes/1/profile')
        .delayConnection(30)
        .reply(200, mockResponse);

      const data = await hahowApi.ProfileOfHero('1');
      expect(data).to.deep.equal(mockResponse, 'hahowApi.ProfileOfHero 成功時回傳data應與mockResponse相同');
    });
  });

  describe('ProfileOfHero 失敗測試', () => {
    it('沒給heroId => 應Throw Error', async () => {
      const mockResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      nock(mockHahowApiUrl)
        .get('/heroes/1/profile')
        .reply(200, mockResponse);

      await expect(hahowApi.ProfileOfHero()).to.eventually
        .be.rejectedWith(Error)
        .and.be.not.an.instanceOf(ApiError);
    });

    it('Backend Error 6 次後才成功 (重試設定為5次) => 應Throw Error', async () => {
      const mockBackendError = { 'code':1000, 'message':'Backend error' };
      const mockResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      nock(mockHahowApiUrl)
        .get('/heroes/1/profile')
        .reply(200, mockBackendError)
        .get('/heroes/1/profile')
        .reply(200, mockBackendError)
        .get('/heroes/1/profile')
        .reply(200, mockBackendError)
        .get('/heroes/1/profile')
        .reply(200, mockBackendError)
        .get('/heroes/1/profile')
        .reply(200, mockBackendError)
        .get('/heroes/1/profile')
        .reply(200, mockBackendError)
        .get('/heroes/1/profile')
        .reply(200, mockResponse);

      await expect(hahowApi.ProfileOfHero('1')).to.eventually
        .be.rejectedWith(Error)
        .and.be.not.an.instanceOf(ApiError);
    });

    it('statusCode 為 404 => 應Throw ApiError', async () => {
      const mockResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      nock(mockHahowApiUrl)
        .get('/heroes/1/profile')
        .reply(404, mockResponse);

      await expect(hahowApi.ProfileOfHero('1')).to.eventually
        .be.rejectedWith(ApiError)
        .and.has.property('status', 404);
    });

    it('statusCode 為 500 => 應Throw Error', async () => {
      const mockResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      nock(mockHahowApiUrl)
        .get('/heroes/1/profile')
        .reply(500, mockResponse);

      await expect(hahowApi.ProfileOfHero('1')).to.eventually
        .be.rejectedWith(Error)
        .and.be.not.an.instanceOf(ApiError);
    });

    it('delay 500 ms => 應timeout並Throw Error', async () => {
      const mockResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      nock(mockHahowApiUrl)
        .get('/heroes/1/profile')
        .delayConnection(500)
        .reply(200, mockResponse);

      await expect(hahowApi.ProfileOfHero('1')).to.eventually
        .be.rejectedWith(Error)
        .and.be.not.an.instanceOf(ApiError);
    });
  });
});

