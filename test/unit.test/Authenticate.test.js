const chai = require('chai');
const nock = require('nock');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const HahowApi = require('../../externalApi/HahowApi');
const { ApiError } = require('../../lib/ApiError');

const mockHahowApiUrl = 'http://HahowApiUrl.test';
const mockHahowApiTimeout = 300;
const hahowApi = new HahowApi(mockHahowApiUrl, mockHahowApiTimeout);

describe('Unit test - HahowApi.Authenticate', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('Authenticate 成功測試', () => {
    it('回傳200且不為Backend Error => 應成功', async () => {
      const mockResponse = 'OK';
      nock(mockHahowApiUrl)
        .post('/auth')
        .reply(200, mockResponse);

      await hahowApi.Authenticate('hahow', 'rocks');
    });

    it('Backend Error 5 次後成功 => 應成功', async () => {
      const mockBackendError = { 'code':1000, 'message':'Backend error' };
      const mockResponse = 'OK';
      nock(mockHahowApiUrl)
        .post('/auth')
        .reply(200, mockBackendError)
        .post('/auth')
        .reply(200, mockBackendError)
        .post('/auth')
        .reply(200, mockBackendError)
        .post('/auth')
        .reply(200, mockBackendError)
        .post('/auth')
        .reply(200, mockBackendError)
        .post('/auth')
        .reply(200, mockResponse);

      await hahowApi.Authenticate('hahow', 'rocks');
    });

    it('delay 30 ms => 應成功回傳英雄檔案', async () => {
      const mockResponse = 'OK';
      nock(mockHahowApiUrl)
        .post('/auth')
        .delayConnection(30)
        .reply(200, mockResponse);

      await hahowApi.Authenticate('hahow', 'rocks');
    });
  });

  describe('Authenticate 失敗測試', () => {
    it('沒給name => 應Throw Error', async () => {
      const mockResponse = 'OK';
      nock(mockHahowApiUrl)
        .post('/auth')
        .reply(200, mockResponse);

      await expect(hahowApi.Authenticate('', 'rocks')).to.eventually
        .be.rejectedWith(Error)
        .and.be.not.an.instanceOf(ApiError);
    });

    it('沒給password => 應Throw Error', async () => {
      const mockResponse = 'OK';
      nock(mockHahowApiUrl)
        .post('/auth')
        .reply(200, mockResponse);

      await expect(hahowApi.Authenticate('hahow', '')).to.eventually
        .be.rejectedWith(Error)
        .and.be.not.an.instanceOf(ApiError);
    });

    it('Backend Error 6 次後才成功 (重試設定為5次) => 應Throw Error', async () => {
      const mockBackendError = { 'code':1000, 'message':'Backend error' };
      const mockResponse = 'OK';
      nock(mockHahowApiUrl)
        .post('/auth')
        .reply(200, mockBackendError)
        .post('/auth')
        .reply(200, mockBackendError)
        .post('/auth')
        .reply(200, mockBackendError)
        .post('/auth')
        .reply(200, mockBackendError)
        .post('/auth')
        .reply(200, mockBackendError)
        .post('/auth')
        .reply(200, mockBackendError)
        .post('/auth')
        .reply(200, mockResponse);

      await expect(hahowApi.Authenticate('hahow', 'rocks')).to.eventually
        .be.rejectedWith(Error)
        .and.be.not.an.instanceOf(ApiError);
    });

    it('statusCode 為 401 => 應Throw ApiError', async () => {
      const mockResponse = 'OK';
      nock(mockHahowApiUrl)
        .post('/auth')
        .reply(401, mockResponse);

      await expect(hahowApi.Authenticate('hahow', 'rocks')).to.eventually
        .be.rejectedWith(ApiError)
        .and.has.property('status', 401);
    });

    it('statusCode 為 500 => 應Throw Error', async () => {
      const mockResponse = 'OK';
      nock(mockHahowApiUrl)
        .post('/auth')
        .reply(500, mockResponse);

      await expect(hahowApi.Authenticate('hahow', 'rocks')).to.eventually
        .be.rejectedWith(Error)
        .and.be.not.an.instanceOf(ApiError);
    });

    it('delay 500 ms => 應timeout並Throw Error', async () => {
      const mockResponse = 'OK';
      nock(mockHahowApiUrl)
        .post('/auth')
        .delayConnection(500)
        .reply(200, mockResponse);

      await expect(hahowApi.Authenticate('hahow', 'rocks')).to.eventually
        .be.rejectedWith(Error)
        .and.be.not.an.instanceOf(ApiError);
    });
  });
});

