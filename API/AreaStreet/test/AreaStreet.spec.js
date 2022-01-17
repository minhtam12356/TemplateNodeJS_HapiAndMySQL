const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const { loginStaff } = require('../../Common/test/CommonTestFunctions');

const { checkResponseStatus } = require('../../Common/test/Common');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const Model = require('../resourceAccess/AreaStreetResourceAccess');

const app = require('../../../server');

describe(`Tests ${Model.modelName}`, function() {
  let token = "";
  let id = 0;
  before(done => {
    new Promise(async function(resolve, reject) {
      resolve();
    }).then(() => done());
  });

  it("Login Staff", done => {
    loginStaff().then(result => {
      if(result && Object.keys(result).length > 0) {
        token = `Bearer ${result.token}`;
        done();
      }
    });
  });

  it('Insert Street Success', done => {
    const body = {
      "AreaStreetName": faker.name.firstName(),
      "AreaStreetKey": faker.name.lastName()
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AreaStreet/insert`)
      .set('Authorization', token)
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        if(res && res.body && res.body.statusCode === 200) {
          id = res.body.data[0];
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Insert Street Error', done => {
    const body = {
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AreaStreet/insert`)
      .set('Authorization', token)
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        checkResponseStatus(res, 400);
        done();
      });
  });

  it('Update Street Error', done => {
    const body = {
      "id": 0
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AreaStreet/updateById`)
      .set('Authorization', token)
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        checkResponseStatus(res, 500);
        done();
      });
  });

  it('Delete Street Success', done => {
    const body = {
      "id": id
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AreaStreet/updateById`)
      .set('Authorization', token)
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Delete Street Error', done => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AreaStreet/updateById`)
      .set('Authorization', token)
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        checkResponseStatus(res, 400);
        done();
      });
  });

  it('Update Street Success', done => {
    const body = {
      "id": id,
      "data": {
        "isDeleted": 1
      }
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AreaStreet/updateById`)
      .set('Authorization', token)
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
