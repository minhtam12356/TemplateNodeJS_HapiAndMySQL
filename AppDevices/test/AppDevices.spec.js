const moment = require('moment');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { checkResponseStatus } = require('../../Common/test/Common');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const Model = require('../model/UserRecord');

const app = require('../../server');

describe(`Tests ${Model.modelName}`, function() {
  let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJQcm9qZWN0TmFtZSI6InN0cmluZyIsIlByb2plY3RFbnZpcm9ubWVudCI6IkRldmVsb3BtZW50IiwiUHJvamVjdEFQSUtleSI6IjB4NzRjRTJjYmUzYWNlYjdjRjEwNDlCNzFmMjI5OEM5OWU1NTYxOWMyYSIsIlByaXZhdGVLZXkiOiIweDZhNjMxNzVhYmE4NjAzN2Q1MDlkNjVmZjVlOGFiMGNiZGE3NzI0ZDFjMDY1YjkyZDkzZDU5YjU1NmE0Nzc0OTgiLCJQcm9qZWN0U3RhdHVzIjoiYWN0aXZlIiwiRXhwaXJlZERhdGUiOiIxNjI5ODYwNDc2IiwiaWF0IjoxNjI0NzYyODc2LCJleHAiOjE2Mjk5NDY4NzZ9.Zb02ImjQ-Qs4SCXTIjhwE7FKxEfJr2SfkpD5a6k9I90";
  let idTestItem = "";
  before(done => {
    new Promise(async function(resolve, reject) {
      resolve();
    }).then(() => done());
  });

  it('Get list', done => {
    const body = {
      "filter": {},
      "skip": 0,
      "limit": 20,
      "order": {}
    };
    chai
      .request(`0.0.0.0:9999`)
      .post(`/UserRecord/list`)
      .set({ Authorization: `Bearer ${token}` })
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        idTestItem = res.body.data.resultData[0]._id;
        done();
      });
  });

  it('Get list full', done => {
    const body = {
      "filter": {},
      "skip": 0,
      "limit": 20,
      "order": {}
    };
    chai
      .request(`0.0.0.0:9999`)
      .post(`/UserRecord/listFull`)
      .set({ Authorization: `Bearer ${token}` })
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Search by id', done => {
    const body = {
      "id": idTestItem
    }
    chai
      .request(`0.0.0.0:9999`)
      .post(`/UserRecord/searchById`)
      .set({ Authorization: `Bearer ${token}` })
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
});
