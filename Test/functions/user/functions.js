const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const mocha = require('mocha');
const describe = mocha.describe;
const should = require('chai').should();
const testConstants = require('../../constants');
const { checkResponseStatus , checkResponseBody} = require('../../common');

const domainTest = testConstants.baseUrl;

async function loginUser(userName, password) {
  let body = {
    username: userName,
    password: password
  }
  return new Promise((resolve, reject) => {
    chai
      .request(`${domainTest}`)
      .post(`/User/loginUser`)
      .send(body)
      .end((err, res) => {
        checkResponseStatus(res, 200);
        resolve(res.body.data);
      });
  });
}

async function registerUser(userData) {
  let body = {};
  if (userData.lastName) body["lastName"] = userData.lastName;
  if (userData.firstName) body["firstName"] = userData.firstName;
  if (userData.username) body["username"] = userData.username;
  if (userData.email) body["email"] = userData.email;
  if (userData.password) body["password"] = userData.password;
  if (userData.phoneNumber) body["phoneNumber"] = userData.phoneNumber;

  return new Promise((resolve, reject) => {
    chai
      .request(`${domainTest}`)
      .post(`/User/registerUser`)
      .send(body)
      .end((err, res) => {
        checkResponseStatus(res, 200);
        resolve(res);
      });
  });
}

module.exports = {
  loginUser,
  registerUser
};
