const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const mocha = require('mocha');
const describe = mocha.describe;
const should = require('chai').should();

const it = mocha.it;

const { token, merchantcode, baseUrl } = require('../../constants');

chai.use(chaiHttp);

describe('Test chức năng menu trên tablet', function() {});
