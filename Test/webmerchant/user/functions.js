const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const mocha = require('mocha');
const describe = mocha.describe;
const should = require('chai').should();
const testConstants = require('../../constants');
const { checkResponseStatus } = require('../../common');

const domainTest = testConstants.baseUrl;
const token = testConstants.token.staff.token;
const merchantcode = testConstants.merchantcode;
const restaurantId = testConstants.envData.restaurant.id;
const floorId = testConstants.envData.floorId;

async function loadMerchantSettings(merchanId) {
  return new Promise((resolve, reject) => {
    chai
      .request(`${domainTest}`)
      .get(`/users/merchant-setting`)
      .send(body)
      .end((err, res) => {
        console.log(res);
        checkResponseStatus(res, 200);
        resolve(res.body.data);
      });
  });
}

module.exports = {
  loadMerchantSettings,
};
