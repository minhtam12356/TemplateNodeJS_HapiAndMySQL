const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { checkResponseStatus } = require('../../Common/test/Common');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const Model = require('../resourceAccess/AppUsersResourceAccess');

const app = require('../../server');

describe(`Tests ${Model.modelName}`, function() {
  let token = "";
  let fakeUserName = faker.name.firstName() + faker.name.lastName();
  before(done => {
    new Promise(async function(resolve, reject) {
      resolve();
    }).then(() => done());
  });

  it('Register user', done => {
    const body = {
      "lastName": "string",
      "firstName": "string",
      "username": fakeUserName,
      "email": faker.internet.email(),
      "password": "string",
      "phoneNumber": "string"
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/registerUser`)
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Login app user', done => {
    const body = {
      "username": fakeUserName,
      "password": "string",
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/registerUser`)
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
