/**
 * Created by A on 7/18/17.
 */
'use strict';
const token = require('../utils/token');
const SystemStatus = require('../Maintain/MaintainFunctions').systemStatus;
const errorCodes = require('./route/response').errorCodes;
async function verifyToken(request, reply) {
  new Promise(function (resolve) {
    let result = token.decodeToken(request.headers.authorization);
    //append current user to request
    request.currentUser = result;

    if (result === undefined || (result.appUserId && SystemStatus.all === false)) {
      reply.response(errorCodes[505]).code(505).takeover();;
    }

    resolve("ok");
  }).then(function () {
    reply('pre-handler done');
  });
}

module.exports = {
  verifyToken
};
