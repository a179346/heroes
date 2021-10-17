const supertest = require('supertest');
const { expect } = require('chai');

const app = require('../../app');

describe('API測試 - GET /unknown_path', () => {
  it('GET /unknown_path 應回傳404 code:"path_not_found"', async () => {
    const response = await supertest(app).get('/unknown_path');
    expect(response.statusCode).to.equal(404, '/unknown_path 應回傳 status 404');
    expect(response.body?.code).to.equal('path_not_found', '/unknown_path 應回傳 code:"path_not_found"');
  });
});