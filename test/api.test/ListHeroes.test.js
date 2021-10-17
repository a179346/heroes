
const supertest = require('supertest');
const { expect } = require('chai');
const nock = require('nock');

const { env } = require('../../config');

const app = require('../../app');

describe('API測試 - List Heroes (GET /heroes)', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('List Heroes (GET /heroes) 成功測試', () => {
    it('200 => 應成功', async () => {
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'id':'2', 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(env.HAHOW_API_URL)
        .get('/heroes')
        .reply(200, mockResponse);

      const response = await supertest(app).get('/heroes');
      expect(response.statusCode).to.equal(200, '應回傳 status 200');
      expect(response.body).to.deep.equal({ heroes: mockResponse }, '回傳 body 應與 mockResponse 相同');
    });

    it('200 英雄為空陣列 => 應成功', async () => {
      const mockResponse = [];
      nock(env.HAHOW_API_URL)
        .get('/heroes')
        .reply(200, mockResponse);

      const response = await supertest(app).get('/heroes');
      expect(response.statusCode).to.equal(200, '應回傳 status 200');
      expect(response.body).to.deep.equal({ heroes: mockResponse }, '回傳 body 應與 mockResponse 相同');
    });

    it('Backend Error 5 次後成功 => 應成功', async () => {
      const mockBackendError = { 'code':1000, 'message':'Backend error' };
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'id':'2', 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(env.HAHOW_API_URL)
        .get('/heroes')
        .reply(200, mockBackendError)
        .get('/heroes')
        .reply(200, mockBackendError)
        .get('/heroes')
        .reply(200, mockBackendError)
        .get('/heroes')
        .reply(200, mockBackendError)
        .get('/heroes')
        .reply(200, mockBackendError)
        .get('/heroes')
        .reply(200, mockResponse);

      const response = await supertest(app).get('/heroes');
      expect(response.statusCode).to.equal(200, '應回傳 status 200');
      expect(response.body).to.deep.equal({ heroes: mockResponse }, '回傳 body 應與 mockResponse 相同');
    });

    it('delay 30 ms => 應成功', async () => {
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'id':'2', 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(env.HAHOW_API_URL)
        .get('/heroes')
        .delayConnection(30)
        .reply(200, mockResponse);

      const response = await supertest(app).get('/heroes');
      expect(response.statusCode).to.equal(200, '應回傳 status 200');
      expect(response.body).to.deep.equal({ heroes: mockResponse }, '回傳 body 應與 mockResponse 相同');
    });
  });

  describe('List Heroes (GET /heroes) 失敗測試', () => {
    it('回傳資料缺少id => 應回傳 500', async () => {
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(env.HAHOW_API_URL)
        .get('/heroes')
        .reply(200, mockResponse);

      const response = await supertest(app).get('/heroes');
      expect(response.statusCode).to.equal(500, '應回傳 status 500');
      expect(response.body?.code).to.equal('internal_server_error', '回傳 code 應為 "internal_server_error"');
    });

    it('Backend Error 6 次後才成功 (重試次數設為5) => 應回傳 500', async () => {
      const mockBackendError = { 'code':1000, 'message':'Backend error' };
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'id':'2', 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(env.HAHOW_API_URL)
        .get('/heroes')
        .reply(200, mockBackendError)
        .get('/heroes')
        .reply(200, mockBackendError)
        .get('/heroes')
        .reply(200, mockBackendError)
        .get('/heroes')
        .reply(200, mockBackendError)
        .get('/heroes')
        .reply(200, mockBackendError)
        .get('/heroes')
        .reply(200, mockBackendError)
        .get('/heroes')
        .reply(200, mockResponse);

      const response = await supertest(app).get('/heroes');
      expect(response.statusCode).to.equal(500, '應回傳 status 500');
      expect(response.body?.code).to.equal('internal_server_error', '回傳 code 應為 "internal_server_error"');
    });

    it('500 => 應回傳 500', async () => {
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'id':'2', 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(env.HAHOW_API_URL)
        .get('/heroes')
        .reply(500, mockResponse);

      const response = await supertest(app).get('/heroes');
      expect(response.statusCode).to.equal(500, '應回傳 status 500');
      expect(response.body?.code).to.equal('internal_server_error', '回傳 code 應為 "internal_server_error"');
    });

    it('delay 500 ms => 應timeout並回傳 500', async () => {
      const mockResponse = [ { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' }, { 'id':'2', 'name':'Thor', 'image':'http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg' }, { 'id':'3', 'name':'Iron Man', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg' } ];
      nock(env.HAHOW_API_URL)
        .get('/heroes')
        .delayConnection(500)
        .reply(200, mockResponse);

      const response = await supertest(app).get('/heroes');
      expect(response.statusCode).to.equal(500, '應回傳 status 500');
      expect(response.body?.code).to.equal('internal_server_error', '回傳 code 應為 "internal_server_error"');
    });
  });
});