const faker = require("faker");
const chai = require("chai");
const chaiHttp = require("chai-http");
// const fs = require('fs');

const { checkResponseStatus } = require("../../Common/test/Common");
const TestFunctions = require("../../Common/test/CommonTestFunctions");
const Constant = require("../PaymentServicePackageConstant");
chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const Model = require("../resourceAccess/PaymentServicePackageResourceAccess");

const app = require("../../../server");

describe(`Tests ${Model.modelName}`, () => {
  let token = "";
  let userToken = "";
  let id;
  before((done) => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      token = staffData.token;
      let userData = await TestFunctions.loginUser();
      userToken = userData.token;
      resolve();
    }).then(() => done());
  });

  it("insert payment service package", (done) => {
    const body = {
      paymentPackageName: faker.random.words(),
      rechargePackage: faker.random.number(10),
      promotion: faker.random.number(10),
      status: Constant.PACKAGE_STATUS.NEW,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/insert`)
      .set("Authorization", `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        id = res.body.data[0];
        done();
      });
  });

  it("find payment service package", (done) => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/find`)
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

  it("update payment service package", (done) => {
    const body = {
      id: id,
      data: {
        paymentPackageName: faker.random.words(),
        rechargePackage: faker.random.number(10),
        promotion: faker.random.number(10),
        status: Constant.PACKAGE_STATUS.NORMAL,
      },
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/updateById`)
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

  it("delete payment service package", (done) => {
    const body = {
      id: id,
    };

    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/deleteById`)
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
  it("get payment service package by id", (done) => {
    const body = {
      id: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/findById`)
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

  it("user get payment service package", (done) => {
    const body = {};
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/getListByUser`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it("user payment service package by id", (done) => {
    const body = {
      id: id,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/PaymentServicePackage/userGetPaymentPackageById`)
      .set("Authorization", `Bearer ${userToken}`)
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
