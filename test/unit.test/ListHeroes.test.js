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

describe('Unit test - HahowApi.ListHeroes', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('ListHeroes 成功測試', () => {
    it('成功時應回傳英雄Array', async () => {
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'id':'2', 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(mockHahowApiUrl)
        .get('/heroes')
        .reply(200, mockResponse);

      const data = await hahowApi.ListHeroes();
      expect(data).to.deep.equal(mockResponse, 'hahowApi.ListHeroes 成功時回傳data應與mockResponse相同');
    });

    it('response為空陣列 => 應成功', async () => {
      const mockResponse = [];
      nock(mockHahowApiUrl)
        .get('/heroes')
        .reply(200, mockResponse);

      const data = await hahowApi.ListHeroes();
      expect(data).to.deep.equal(mockResponse, 'hahowApi.ListHeroes 成功時回傳data應與mockResponse相同');
    });

    it('Backend Error 5 次後成功 => 應成功', async () => {
      const mockBackendErrorResponse = { 'code':1000, 'message':'Backend error' };
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'id':'2', 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(mockHahowApiUrl)
        .get('/heroes')
        .reply(200, mockBackendErrorResponse)
        .get('/heroes')
        .reply(200, mockBackendErrorResponse)
        .get('/heroes')
        .reply(200, mockBackendErrorResponse)
        .get('/heroes')
        .reply(200, mockBackendErrorResponse)
        .get('/heroes')
        .reply(200, mockBackendErrorResponse)
        .get('/heroes')
        .reply(200, mockResponse);

      const data = await hahowApi.ListHeroes();
      expect(data).to.deep.equal(mockResponse, 'hahowApi.ListHeroes 成功時回傳data應與mockResponse相同');
    });

    it('delay 30 ms => 應成功回傳英雄Array', async () => {
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'id':'2', 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(mockHahowApiUrl)
        .get('/heroes')
        .delayConnection(30)
        .reply(200, mockResponse);

      const data = await hahowApi.ListHeroes();
      expect(data).to.deep.equal(mockResponse, 'hahowApi.ListHeroes 成功時回傳data應與mockResponse相同');
    });
  });

  describe('ListHeroes 失敗測試', () => {
    it('回傳資料缺少id => 應Throw Error', async () => {
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(mockHahowApiUrl)
        .get('/heroes')
        .reply(200, mockResponse);

      await expect(hahowApi.ListHeroes()).to.eventually
        .be.rejectedWith(Error)
        .and.be.not.an.instanceOf(ApiError);
    });

    it('Backend Error 6 次後成功 (重試次數設為5) => 應Throw Error', async () => {
      const mockBackendErrorResponse = { 'code':1000, 'message':'Backend error' };
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'id':'2', 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(mockHahowApiUrl)
        .get('/heroes')
        .reply(200, mockBackendErrorResponse)
        .get('/heroes')
        .reply(200, mockBackendErrorResponse)
        .get('/heroes')
        .reply(200, mockBackendErrorResponse)
        .get('/heroes')
        .reply(200, mockBackendErrorResponse)
        .get('/heroes')
        .reply(200, mockBackendErrorResponse)
        .get('/heroes')
        .reply(200, mockBackendErrorResponse)
        .get('/heroes')
        .reply(200, mockResponse);

      await expect(hahowApi.ListHeroes()).to.eventually
        .be.rejectedWith(Error)
        .and.be.not.an.instanceOf(ApiError);
    });

    it('statusCode 為 404 => 應Throw Error', async () => {
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'id':'2', 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(mockHahowApiUrl)
        .get('/heroes')
        .reply(404, mockResponse);

      await expect(hahowApi.ListHeroes()).to.eventually
        .be.rejectedWith(Error)
        .and.be.not.an.instanceOf(ApiError);
    });

    it('statusCode 為 500 => 應Throw Error', async () => {
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'id':'2', 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(mockHahowApiUrl)
        .get('/heroes')
        .reply(500, mockResponse);

      await expect(hahowApi.ListHeroes()).to.eventually
        .be.rejectedWith(Error)
        .and.be.not.an.instanceOf(ApiError);
    });

    it('delay 500 ms => 應timeout並Throw Error', async () => {
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'id':'2', 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(mockHahowApiUrl)
        .get('/heroes')
        .delayConnection(500)
        .reply(200, mockResponse);

      await expect(hahowApi.ListHeroes()).to.eventually
        .be.rejectedWith(Error)
        .and.be.not.an.instanceOf(ApiError);
    });
  });
});

