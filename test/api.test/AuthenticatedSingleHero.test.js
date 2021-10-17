const supertest = require('supertest');
const { expect } = require('chai');
const nock = require('nock');

const { env } = require('../../config');

const app = require('../../app');

describe('API測試 - AuthenticatedSingleHero (GET /heroes/:heroId)', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('AuthenticatedSingleHero (GET /heroes/:heroId) 成功測試', () => {
    it('200 => 應成功', async () => {
      const mockAuthResponse = 'OK';
      const mockProfileResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      const mockHeroResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .post('/auth')
        .reply(200, mockAuthResponse)
        .get('/heroes/1')
        .reply(200, mockHeroResponse)
        .get('/heroes/1/profile')
        .reply(200, mockProfileResponse);

      const response = await supertest(app).get('/heroes/1').set('Name', 'hahow').set('Password', 'rocks');
      expect(response.statusCode).to.equal(200, '應回傳 status 200');
      mockHeroResponse.profile = mockProfileResponse;
      expect(response.body).to.deep.equal(mockHeroResponse, '回傳 body 應與 mockHeroResponse 相同');
    });

    it('Auth Backend Error 5 次後成功 => 應成功', async () => {
      const mockBackendError = { 'code':1000, 'message':'Backend error' };
      const mockAuthResponse = 'OK';
      const mockProfileResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      const mockHeroResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
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
        .reply(200, mockAuthResponse)
        .get('/heroes/1')
        .reply(200, mockHeroResponse)
        .get('/heroes/1/profile')
        .reply(200, mockProfileResponse);

      const response = await supertest(app).get('/heroes/1').set('Name', 'hahow').set('Password', 'rocks');
      expect(response.statusCode).to.equal(200, '應回傳 status 200');
      mockHeroResponse.profile = mockProfileResponse;
      expect(response.body).to.deep.equal(mockHeroResponse, '回傳 body 應與 mockHeroResponse 相同');
    });

    it('Profile Backend Error 5 次後成功 => 應成功', async () => {
      const mockBackendError = { 'code':1000, 'message':'Backend error' };
      const mockAuthResponse = 'OK';
      const mockProfileResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      const mockHeroResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .post('/auth')
        .reply(200, mockAuthResponse)
        .get('/heroes/1')
        .reply(200, mockHeroResponse)
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
        .reply(200, mockProfileResponse);

      const response = await supertest(app).get('/heroes/1').set('Name', 'hahow').set('Password', 'rocks');
      expect(response.statusCode).to.equal(200, '應回傳 status 200');
      mockHeroResponse.profile = mockProfileResponse;
      expect(response.body).to.deep.equal(mockHeroResponse, '回傳 body 應與 mockHeroResponse 相同');
    });

    it('Auth delay 30 ms => 應成功', async () => {
      const mockAuthResponse = 'OK';
      const mockProfileResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      const mockHeroResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .post('/auth')
        .delayConnection(30)
        .reply(200, mockAuthResponse)
        .get('/heroes/1')
        .reply(200, mockHeroResponse)
        .get('/heroes/1/profile')
        .reply(200, mockProfileResponse);

      const response = await supertest(app).get('/heroes/1').set('Name', 'hahow').set('Password', 'rocks');
      expect(response.statusCode).to.equal(200, '應回傳 status 200');
      mockHeroResponse.profile = mockProfileResponse;
      expect(response.body).to.deep.equal(mockHeroResponse, '回傳 body 應與 mockHeroResponse 相同');
    });

    it('Profile delay 30 ms => 應成功', async () => {
      const mockAuthResponse = 'OK';
      const mockProfileResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      const mockHeroResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .post('/auth')
        .reply(200, mockAuthResponse)
        .get('/heroes/1')
        .reply(200, mockHeroResponse)
        .get('/heroes/1/profile')
        .delayConnection(30)
        .reply(200, mockProfileResponse);

      const response = await supertest(app).get('/heroes/1').set('Name', 'hahow').set('Password', 'rocks');
      expect(response.statusCode).to.equal(200, '應回傳 status 200');
      mockHeroResponse.profile = mockProfileResponse;
      expect(response.body).to.deep.equal(mockHeroResponse, '回傳 body 應與 mockHeroResponse 相同');
    });
  });

  describe('AuthenticatedSingleHero (GET /heroes/:heroId) Auth失敗測試', () => {
    it('Auth Backend Error 6 次後才成功 (重試設定為5次) => 應回傳 500', async () => {
      const mockBackendError = { 'code':1000, 'message':'Backend error' };
      const mockAuthResponse = 'OK';
      const mockProfileResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      const mockHeroResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
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
        .reply(200, mockAuthResponse)
        .get('/heroes/1')
        .reply(200, mockHeroResponse)
        .get('/heroes/1/profile')
        .reply(200, mockProfileResponse);

      const response = await supertest(app).get('/heroes/1').set('Name', 'hahow').set('Password', 'rocks');
      expect(response.statusCode).to.equal(500, '應回傳 status 500');
      expect(response.body?.code).to.equal('internal_server_error', '回傳 code 應為 "internal_server_error"');
    });

    it('Auth statusCode 為 401 => 應回傳 401', async () => {
      const mockAuthResponse = 'Unauthorized';
      const mockProfileResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      const mockHeroResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .post('/auth')
        .reply(401, mockAuthResponse)
        .get('/heroes/1')
        .reply(200, mockHeroResponse)
        .get('/heroes/1/profile')
        .reply(200, mockProfileResponse);

      const response = await supertest(app).get('/heroes/1').set('Name', 'hahow').set('Password', 'rocks');
      expect(response.statusCode).to.equal(401, '應回傳 status 401');
      expect(response.body?.code).to.equal('unauthorized', '回傳 code 應為 "unauthorized"');
    });

    it('Auth statusCode 為 500 => 應回傳 500', async () => {
      const mockAuthResponse = 'OK';
      const mockProfileResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      const mockHeroResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .post('/auth')
        .reply(500, mockAuthResponse)
        .get('/heroes/1')
        .reply(200, mockHeroResponse)
        .get('/heroes/1/profile')
        .reply(200, mockProfileResponse);

      const response = await supertest(app).get('/heroes/1').set('Name', 'hahow').set('Password', 'rocks');
      expect(response.statusCode).to.equal(500, '應回傳 status 500');
      expect(response.body?.code).to.equal('internal_server_error', '回傳 code 應為 "internal_server_error"');
    });

    it('Auth delay 500 ms => 應timeout並回傳 500', async () => {
      const mockAuthResponse = 'OK';
      const mockProfileResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      const mockHeroResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .post('/auth')
        .delayConnection(500)
        .reply(200, mockAuthResponse)
        .get('/heroes/1')
        .reply(200, mockHeroResponse)
        .get('/heroes/1/profile')
        .reply(200, mockProfileResponse);

      const response = await supertest(app).get('/heroes/1').set('Name', 'hahow').set('Password', 'rocks');
      expect(response.statusCode).to.equal(500, '應回傳 status 500');
      expect(response.body?.code).to.equal('internal_server_error', '回傳 code 應為 "internal_server_error"');
    });
  });

  describe('AuthenticatedSingleHero (GET /heroes/:heroId) Profile失敗測試', () => {
    it('Profile Backend Error 6 次後才成功 (重試設定為5次) => 應回傳 500', async () => {
      const mockBackendError = { 'code':1000, 'message':'Backend error' };
      const mockAuthResponse = 'OK';
      const mockProfileResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      const mockHeroResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .post('/auth')
        .reply(200, mockAuthResponse)
        .get('/heroes/1')
        .reply(200, mockHeroResponse)
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
        .reply(200, mockProfileResponse);

      const response = await supertest(app).get('/heroes/1').set('Name', 'hahow').set('Password', 'rocks');
      expect(response.statusCode).to.equal(500, '應回傳 status 500');
      expect(response.body?.code).to.equal('internal_server_error', '回傳 code 應為 "internal_server_error"');
    });

    it('Profile statusCode 為 404 => 應回傳 404', async () => {
      const mockAuthResponse = 'OK';
      const mockProfileResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      const mockHeroResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .post('/auth')
        .reply(200, mockAuthResponse)
        .get('/heroes/1')
        .reply(200, mockHeroResponse)
        .get('/heroes/1/profile')
        .reply(404, mockProfileResponse);

      const response = await supertest(app).get('/heroes/1').set('Name', 'hahow').set('Password', 'rocks');
      expect(response.statusCode).to.equal(404, '應回傳 status 404');
      expect(response.body?.code).to.equal('not_found', '回傳 code 應為 "not_found"');
    });

    it('Profile statusCode 為 500 => 應回傳 500', async () => {
      const mockAuthResponse = 'OK';
      const mockProfileResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      const mockHeroResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .post('/auth')
        .reply(200, mockAuthResponse)
        .get('/heroes/1')
        .reply(200, mockHeroResponse)
        .get('/heroes/1/profile')
        .reply(500, mockProfileResponse);

      const response = await supertest(app).get('/heroes/1').set('Name', 'hahow').set('Password', 'rocks');
      expect(response.statusCode).to.equal(500, '應回傳 status 500');
      expect(response.body?.code).to.equal('internal_server_error', '回傳 code 應為 "internal_server_error"');
    });

    it('Profile delay 500 ms => 應回傳 500', async () => {
      const mockAuthResponse = 'OK';
      const mockProfileResponse = { 'str':2, 'int':7, 'agi':9, 'luk':7 };
      const mockHeroResponse = { 'id':'1', 'name':'Daredevil', 'image':'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg' };
      nock(env.HAHOW_API_URL)
        .post('/auth')
        .reply(200, mockAuthResponse)
        .get('/heroes/1')
        .reply(200, mockHeroResponse)
        .get('/heroes/1/profile')
        .delayConnection(500)
        .reply(200, mockProfileResponse);

      const response = await supertest(app).get('/heroes/1').set('Name', 'hahow').set('Password', 'rocks');
      expect(response.statusCode).to.equal(500, '應回傳 status 500');
      expect(response.body?.code).to.equal('internal_server_error', '回傳 code 應為 "internal_server_error"');
    });
  });
});