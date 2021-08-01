/**
 * Created by A on 7/18/17.
 */
"use strict";
const AppUsersResourceAccess = require("../resourceAccess/AppUsersResourceAccess");
const AppUsersFunctions = require("../AppUsersFunctions");
const TokenFunction = require('../../utils/token');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = req.payload;

      //hash password
      userData.password = AppUsersFunctions.hashPassword(userData.password);

      //create new user
      let addResult = await AppUsersResourceAccess.insert(userData);
      if (addResult === undefined) {
        reject("can not insert user");
        return;
      } else {
        let newUserId = addResult[0];
        await AppUsersFunctions.generate2FACode(newUserId);
        resolve("success");
      }
      return;
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      let users = await WalletUserView.find(filter, skip, limit, order);
      let usersCount = await WalletUserView.count(filter, order);
      if (users && usersCount) {
        resolve({ data: users, total: usersCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = req.payload.data;
      let appUserId = req.payload.id;
      let updateResult = await AppUsersResourceAccess.updateById(appUserId, userData);
      if (updateResult) {
        resolve("success");
      } else {
        resolve("failed to update user");
      }

    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};
async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      foundUser = await AppUsersFunctions.retrieveUserDetail(req.payload.id);
      resolve(foundUser);
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function registerUser(req) {
  return insert(req);
};

async function loginUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userName = req.payload.username;
      let password = req.payload.password;

      //verify credential
      let foundUser = await AppUsersFunctions.verifyCredentials(userName, password);
      console.log(foundUser);
      if (foundUser) {

        //create new login token
        let token = TokenFunction.createToken(foundUser);

        // console.log()
        foundUser = await AppUsersFunctions.retrieveUserDetail(foundUser.appUserId);
        console.log(foundUser);
        //if success to get detail
        if (foundUser) {
          foundUser.token = token;
        }

        await AppUsersResourceAccess.updateById(foundUser.appUserId, { lastActiveAt: new Date() });

        if (foundUser.twoFAEnable && foundUser.twoFAEnable > 0) {
          resolve({
            appUserId: foundUser.appUserId,
            twoFAEnable: foundUser.twoFAEnable
          });
        } else {
          resolve(foundUser);
        }
      }

      reject("failed");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function resetPasswordUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve("success");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function changePasswordUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userName = req.payload.username;
      let password = req.payload.password;
      let newPassword = req.payload.newPassword;
      //verify credential
      let foundUser = await AppUsersFunctions.verifyCredentials(userName, password);

      if (foundUser) {
        let result = AppUsersFunctions.changeUserPassword(foundUser, newPassword);
        if (result) {
          resolve(result);
        }
      }
      reject("change user password failed")
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function verify2FA(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await AppUsersResourceAccess.find({ appUserId: req.payload.id });
      if (users && users.length > 0) {
        let foundUser = users[0];
        if (foundUser) {
          let otpCode = req.payload.otpCode;

          let verified = AppUsersFunctions.verify2FACode(otpCode.toString(), foundUser.twoFACode);

          if (verified) {
            //create new login token
            let token = TokenFunction.createToken(foundUser);

            foundUser = await AppUsersFunctions.retrieveUserDetail(foundUser.appUserId);

            //if success to get detail
            if (foundUser) {
              foundUser.token = token;
            }

            await AppUsersResourceAccess.updateById(foundUser.appUserId, {
              twoFAEnable: true,
            });
            resolve(foundUser);
          } else {
            reject("failed to verify2FA");
          }
        } else {
          reject("user is invalid to verify2FA");
        }
      } else {
        reject("user not found to verify2FA");
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  registerUser,
  loginUser,
  resetPasswordUser,
  changePasswordUser,
  verify2FA
};
