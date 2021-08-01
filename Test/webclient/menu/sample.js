const _ = require('lodash');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { checkResponseStatus, checkResponseBody } = require('../../common');
/* sample */
var rhs = {
  body: {
    name: 'updated object',
    description: 'it\'s an object!',
    details: {
      it: 'has',
      an: 'array',
      with: ['a', 'few', 'more', 'elements', { than: 'before' }]
    }
  }
};
checkResponseBody(rhs, './test/mobile/menu/template/sampleresponse.json');