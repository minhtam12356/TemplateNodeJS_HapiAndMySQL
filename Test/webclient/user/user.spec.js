const _ = require('lodash');
const chai = require('chai');
const chaiHttp = require('chai-http');
const {checkResponseBody, checkResponseStatus } = require('../../common');
const UserFunctions = require('../../functions/user/functions');
const faker = require('faker');
chai.should();
chai.use(chaiHttp);


const { baseUrl } = require('../../constants');
let newUser;
describe('Test user trên web client', function() {
  it('Tạo mới user bình thường (không có người giới thiệu)', done => {
    const body = {
      "lastName": faker.name.firstName(),
      "firstName": faker.name.lastName(),
      "username": faker.name.firstName() + faker.name.lastName(),
      "email": faker.internet.email(),
      "password": "123456",
      "phoneNumber": faker.phone.phoneNumber(),
    };
    UserFunctions.registerUser(body).then(async (res) => {
      await checkResponseBody(res, './Test/webclient/user/template/registerUser.json');
      newUser = body;
      done();
    })
  });
  it('Tạo mới user bình thường (có người giới thiệu)', done => {
    const supervisorBody = {
      "lastName": faker.name.firstName(),
      "firstName": faker.name.lastName(),
      "username": faker.name.firstName() + faker.name.lastName(),
      "email": faker.internet.email(),
      "password": "123456",
      "phoneNumber": faker.phone.phoneNumber(),
    };
    UserFunctions.registerUser(supervisorBody).then(async (res) => {
      const body = {
        "lastName": faker.name.firstName(),
        "firstName": faker.name.lastName(),
        "username": faker.name.firstName() + faker.name.lastName(),
        "email": faker.internet.email(),
        "password": "123456",
        "phoneNumber": faker.phone.phoneNumber(),
      };
      UserFunctions.registerUser(body).then(async (res) => {
        await checkResponseBody(res, './Test/webclient/user/template/registerUser.json');
        done();
      })
    })
  });
  it('Đăng nhập', done => {
    UserFunctions.loginUser(newUser.username, newUser.password).then(async (res) => {
      done();
    })
  });
});
