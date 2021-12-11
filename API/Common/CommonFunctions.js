/**
 * Created by A on 7/18/17.
 */
'use strict';
const token = require('../ApiUtils/token');
const SystemStatus = require('../Maintain/MaintainFunctions').systemStatus;
const errorCodes = require('./route/response').errorCodes;
const UserResource = require('../AppUsers/resourceAccess/AppUsersResourceAccess');
const StaffResource = require('../Staff/resourceAccess/StaffResourceAccess');

async function verifyToken(request, reply) {
  return new Promise(async function (resolve) {
    let result = token.decodeToken(request.headers.authorization);
    //append current user to request
    request.currentUser = result;

    if (!request.currentUser.active) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    if (result === undefined || (result.appUserId && SystemStatus.all === false)) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    if (result.appUserId) {
      let currentUser = await UserResource.find({appUserId: result.appUserId});
      if (currentUser && currentUser.length > 0 && currentUser[0].active) {
        resolve("ok");
      } else {
        reply.response(errorCodes[505]).code(505).takeover();
        return;
      }
    } else if (result.staffId) {
      let currentStaff = await StaffResource.find({staffId: result.staffId});
      if (currentStaff && currentStaff.length > 0 && currentStaff[0].active) {
        resolve("ok");
      } else {
        reply.response(errorCodes[505]).code(505).takeover();
        return;
      }
    }
    resolve("ok");
  }).then(function () {
    reply('pre-handler done');
  });
}


async function verifyTokenOrAllowEmpty(request, reply) {
  return new Promise(function (resolve) {
    if (request.headers.authorization !== undefined && request.headers.authorization.trim() !== "") {
      let result = token.decodeToken(request.headers.authorization);
  
      if (result === undefined || (result.appUserId && SystemStatus.all === false)) {
        reply.response(errorCodes[505]).code(505).takeover();
        return;
      }
  
      //append current user to request
      request.currentUser = result;
    }

    resolve("ok");
  }).then(function () {
    reply('pre-handler done');
  });
}

async function verifyStaffToken(request, reply) {
  return new Promise(function (resolve) {
    let currentUser = request.currentUser;

    if (!currentUser.staffId || currentUser.staffId < 1) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    if (!currentUser.roleId || currentUser.roleId < 1) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    const AGENT_ROLE = 5;
    if (currentUser.roleId === AGENT_ROLE) {
      //if it is agent, reject user
      reply.response(errorCodes[505]).code(505).takeover();
    }

    resolve("ok");
  }).then(function () {
    reply('pre-handler done');
  });
}

async function verifyAdminToken(request, reply) {
  return new Promise(function (resolve) {
    let currentUser = request.currentUser;

    if (!currentUser.staffId || currentUser.staffId < 1) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    if (!currentUser.roleId || currentUser.roleId < 1) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    const AGENT_ROLE = 5;
    if (currentUser.roleId === AGENT_ROLE) {
      //if it is agent, reject user
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    if (currentUser.roleId != 1) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }
    resolve("ok");
  }).then(function () {
    reply('pre-handler done');
  });
}
//verify token is belong to user or not
//to make sure they can not get info or update other user
async function verifyOwnerToken(request, reply) {
  return new Promise(function (resolve) {
    let currentUser = request.currentUser;
    let userId = request.payload.id;

    if (userId && currentUser.appUserId && userId !== currentUser.appUserId) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    resolve("ok");
  }).then(function () {
    reply('pre-handler done');
  });
}

async function verifyStationToken(request, reply) {
  new Promise(function (resolve) {
    let result = token.decodeToken(request.headers.authorization);
    //append current user to request
    request.currentUser = result;

    if (request.payload.stationsId === undefined || request.payload.stationsId !== result.stationsId) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }
    if (result === undefined || (result.appUserId && SystemStatus.all === false)) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    resolve("ok");
  }).then(function () {
    reply('pre-handler done');
  });
}

module.exports = {
  verifyToken,
  verifyStaffToken,
  verifyOwnerToken,
  verifyStationToken,
  verifyTokenOrAllowEmpty,
  verifyAdminToken
};
