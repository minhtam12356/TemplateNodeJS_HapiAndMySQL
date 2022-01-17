const faker = require("faker");
const chai = require("chai");
const chaiHttp = require("chai-http");
// const fs = require('fs');

const { checkResponseStatus } = require("../../Common/test/Common");
const TestFunctions = require("../../Common/test/CommonTestFunctions");
chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const app = require("../../../server");

describe(`Tests SystemConfiguration`, () => {
  let token = "";
  before((done) => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      token = staffData.token;
      resolve();
    }).then(() => done());
  });

  it("find system configuration", (done) => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/SystemConfiguration/find`)
      .set("Authorization", `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it("Update system version", (done) => {
    const body = {
      data: {
        systemVersion: "1.0.0"
      },
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/SystemConfiguration/updateConfigs`)
      .set("Authorization", `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

});
