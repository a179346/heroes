const supertest = require('supertest');
const { expect } = require('chai');

const app = require('../../app');

describe('API測試 - GET /ping', () => {
  it('GET /ping 應回傳成功', async () => {
    const response = await supertest(app).get('/ping');
    expect(response.statusCode).to.equal(200, '/ping 應回傳 status 200');
    expect(response.text).to.equal('pong', '/ping 應回傳 text pong');
  });
});