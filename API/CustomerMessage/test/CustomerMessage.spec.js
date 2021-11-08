const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const Model = require('../resourceAccess/CustomerMessageResourceAccess');

const app = require('../../../server');

describe(`Tests ${Model.modelName}`, function() {
    let messageId ;
    let token = "";
    before(done => {
      new Promise(async function(resolve, reject) {
        let staffData = await TestFunctions.loginStaff();
        token = staffData.token;
        resolve();
      }).then(() => done());
    });

    it('insert customerMessage', done => {
        const body = {
            "customerMessageCategories": faker.name.findName(),
            "customerRecordPhone": faker.phone.phoneNumber(),
            "customerMessageContent":faker.name.firstName() + faker.name.lastName()  
        };
        chai
          .request(`0.0.0.0:${process.env.PORT}`)
          .post(`/CustomerMessage/insert`)
          .set("Authorization", `Bearer ${token}`)
          .send(body)
          .end((err, res) => {
            if ( err ) {
              console.error(err);
            }
            checkResponseStatus(res, 200);
            messageId = res.body.data[0];
            done();
          });
      });

      it('get list all CustomerMessage', done => {
        const  body = {}
        chai
          .request(`0.0.0.0:${process.env.PORT}`)
          .post(`/CustomerMessage/getList`)
          .set("Authorization", `Bearer ${token}`)
          .send(body)
          .end((err, res) => {
            if ( err ) {
              console.error(err);
            }
            checkResponseStatus(res, 200);
            done();
          });
      });

      it('send SMS filter customerRecord', done => {
        const body = {
            "customerMessageContent": faker.name.findName(),
            "customerMessageCategories":faker.name.firstName() + faker.name.lastName(),
        };
        chai
          .request(`0.0.0.0:${process.env.PORT}`)
          .post(`/CustomerMessage/sendsmsFilter`)
          .set("Authorization", `Bearer ${token}`)
          .send(body)
          .end((err, res) => {
            if ( err ) {
              console.error(err);
            }
            checkResponseStatus(res, 200);
            done();
          });
      });

      it('send SMS filter array', done => {
        const body = {
            "id":[
                {
                    "customerRecordId": 16,
                }
            ]
        };
        chai
          .request(`0.0.0.0:${process.env.PORT}`)
          .post(`/CustomerMessage/sendsmsArray`)
          .set("Authorization", `Bearer ${token}`)
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