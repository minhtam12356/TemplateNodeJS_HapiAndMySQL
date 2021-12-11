const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const { loginStaff } = require('../../Common/test/CommonTestFunctions');

const { checkResponseStatus } = require('../../Common/test/Common');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const Model = require('../resourceAccess/StaffResourceAccess');

const app = require('../../../server');

describe(`Tests ${Model.modelName}`, function() {
  let token = "";

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

  it('Register Staff Success', done => {
    const body = {
      "lastName": faker.name.lastName(),
      "firstName": faker.name.firstName(),
      "username": faker.name.firstName() + faker.name.lastName(),
      "email": faker.internet.email()+Math.random(),
      "password": "string",
      "phoneNumber": "string",
      "AreaCountry": "1",
      "AreaProvince": "1;2;3;4",
      "AreaDistrict": '1;3;4;5',
      "AreaWard": "1;3;4;6"
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Staff/registerStaff`)
      .set('Authorization', token)
      .send(body)
      .end((err, res) => {
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Register Staff Error', done => {
    const body = {
      "lastName": faker.name.lastName(),
      "firstName": faker.name.firstName(),
      "username": faker.name.firstName() + faker.name.lastName(),
      "email": faker.internet.email(),
      "password": "string",
      "phoneNumber": "string",
      "roleId": 3
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Staff/registerStaff`)
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

  it('Insert Staff Error', done => {
    const body = {
      "lastName": faker.name.lastName(),
      "firstName": faker.name.firstName(),
      "username": faker.name.firstName() + faker.name.lastName(),
      "email": faker.internet.email(),
      "password": "string",
      "phoneNumber": "string",
      "AreaCountry": "1",
      "AreaProvince": "PRO1",
      "AreaDistrict": 'DIST1',
      "AreaWard": "WA1",
      "roleId": 1
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Staff/insertStaff`)
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
  it('Insert Staff Success', done => {
    const body = {
      "lastName": faker.name.lastName(),
      "firstName": faker.name.firstName(),
      "username": faker.name.firstName() + faker.name.lastName(),
      "email": faker.internet.email()+Math.random(),
      "password": "string",
      "phoneNumber": "string",
      "AreaCountry": "1",
      "AreaProvince": "1;2;34;5",
      "AreaDistrict": '1;2;3;4',
      "AreaWard": "1;3;7;10"
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Staff/insertStaff`)
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
  
  it('Delete Staff Success', done => {
    const body = {
      "id": 404
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Staff/deleteStaffById`)
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

  it('Update Staff Success', done => {
    const body = {
      "id": 404,
      "data": {
        "lastName": faker.name.firstName(),
        "firstName": faker.name.lastName(),
        "phoneNumber": faker.phone.phoneNumber(),
        "isDeleted": 0
      }
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/Staff/updateStaffById`)
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
