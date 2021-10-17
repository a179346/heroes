const supertest = require('supertest');
const { expect } = require('chai');
const nock = require('nock');

const { env } = require('../../config');

const app = require('../../app');

describe('API測試 - Single Hero (GET /heroes/:heroId)', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('Single Hero (GET /heroes/:heroId) 成功測試', () => {
    it('200 => 應成功', async () => {
      const mockResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .get('/heroes/1')
        .reply(200, mockResponse);

      const response = await supertest(app).get('/heroes/1');
      expect(response.statusCode).to.equal(200, '應回傳 status 200');
      expect(response.body).to.deep.equal(mockResponse, '回傳 body 應與 mockResponse 相同');
    });

    it('Backend Error 5 次後成功 => 應成功', async () => {
      const mockBackendError = { 'code':1000, 'message':'Backend error' };
      const mockResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .get('/heroes/1')
        .reply(200, mockBackendError)
        .get('/heroes/1')
        .reply(200, mockBackendError)
        .get('/heroes/1')
        .reply(200, mockBackendError)
        .get('/heroes/1')
        .reply(200, mockBackendError)
        .get('/heroes/1')
        .reply(200, mockBackendError)
        .get('/heroes/1')
        .reply(200, mockResponse);

      const response = await supertest(app).get('/heroes/1');
      expect(response.statusCode).to.equal(200, '應回傳 status 200');
      expect(response.body).to.deep.equal(mockResponse, '回傳 body 應與 mockResponse 相同');
    });

    it('delay 30 ms => 應成功', async () => {
      const mockResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .get('/heroes/1')
        .delayConnection(30)
        .reply(200, mockResponse);

      const response = await supertest(app).get('/heroes/1');
      expect(response.statusCode).to.equal(200, '應回傳 status 200');
      expect(response.body).to.deep.equal(mockResponse, '回傳 body 應與 mockResponse 相同');
    });
  });

  describe('Single Hero (GET /heroes/:heroId) 失敗測試', () => {
    it('回傳資料缺少id => 應回傳 500', async () => {
      const mockResponse = { 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .get('/heroes/1')
        .reply(200, mockResponse);

      const response = await supertest(app).get('/heroes/1');
      expect(response.statusCode).to.equal(500, '應回傳 status 500');
      expect(response.body?.code).to.equal('internal_server_error', '回傳 code 應為 "internal_server_error"');
    });

    it('Backend Error 6 次後才成功 (重試設定為5次) => 應回傳 500', async () => {
      const mockBackendError = { 'code':1000, 'message':'Backend error' };
      const mockResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .get('/heroes/1')
        .reply(200, mockBackendError)
        .get('/heroes/1')
        .reply(200, mockBackendError)
        .get('/heroes/1')
        .reply(200, mockBackendError)
        .get('/heroes/1')
        .reply(200, mockBackendError)
        .get('/heroes/1')
        .reply(200, mockBackendError)
        .get('/heroes/1')
        .reply(200, mockBackendError)
        .get('/heroes/1')
        .reply(200, mockResponse);

      const response = await supertest(app).get('/heroes/1');
      expect(response.statusCode).to.equal(500, '應回傳 status 500');
      expect(response.body?.code).to.equal('internal_server_error', '回傳 code 應為 "internal_server_error"');
    });

    it('statusCode 為 404 => 應回傳 404', async () => {
      const mockResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .get('/heroes/1')
        .reply(404, mockResponse);

      const response = await supertest(app).get('/heroes/1');
      expect(response.statusCode).to.equal(404, '應回傳 status 404');
      expect(response.body?.code).to.equal('not_found', '回傳 code 應為 "not_found"');
    });

    it('statusCode 為 500 => 應回傳 500', async () => {
      const mockResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .get('/heroes/1')
        .reply(500, mockResponse);

      const response = await supertest(app).get('/heroes/1');
      expect(response.statusCode).to.equal(500, '應回傳 status 500');
      expect(response.body?.code).to.equal('internal_server_error', '回傳 code 應為 "internal_server_error"');
    });

    it('delay 500 ms => 應timeout並回傳 500', async () => {
      const mockResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .get('/heroes/1')
        .delayConnection(500)
        .reply(200, mockResponse);

      const response = await supertest(app).get('/heroes/1');
      expect(response.statusCode).to.equal(500, '應回傳 status 500');
      expect(response.body?.code).to.equal('internal_server_error', '回傳 code 應為 "internal_server_error"');
    });
  });
});