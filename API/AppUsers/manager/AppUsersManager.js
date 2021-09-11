/**
 * Created by A on 7/18/17.
 */
"use strict";
const AppUsersResourceAccess = require("../resourceAccess/AppUsersResourceAccess");
const AppUsersFunctions = require("../AppUsersFunctions");
const TokenFunction = require('../../ApiUtils/token');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = req.payload;

      let insertResult = AppUsersFunctions.createNewUser(userData);

      resolve(insertResult);

      return;
    } catch (e) {
      Logger.error(__filename, e);
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

      let users = await AppUsersResourceAccess.find(filter, skip, limit, order);
      let usersCount = await AppUsersResourceAccess.count(filter, order);
      if (users && usersCount) {
        resolve({ data: users, total: usersCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
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
      Logger.error(__filename, e);
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
      Logger.error(__filename, e);
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

      if (foundUser) {
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
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function resetPasswordUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve("success");
    } catch (e) {
      Logger.error(__filename, e);
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
      Logger.error(__filename, e);
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
            foundUser = await AppUsersFunctions.retrieveUserDetail(foundUser.appUserId);

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
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

async function _loginSocial(userName, password, name, email, avatar, socialInfo) {
  //verify credential
  let foundUser = await AppUsersFunctions.verifyCredentials(userName, password);

  //if user is not found
  if (!foundUser) {
    let newUserData = {
      userName: userName,
      password: password,
      firstName: name,
      email: email,
      userAvatar: avatar,
      
    }

    if (socialInfo) {
      newUserData.socialInfo = JSON.stringify(socialInfo);
    }

    let registerResult = await AppUsersFunctions.createNewUser(newUserData);
    if (registerResult !== "success") {
      return undefined; 
    }
  }

  foundUser = await AppUsersFunctions.verifyCredentials(userName, password);

  await AppUsersResourceAccess.updateById(foundUser.appUserId, { lastActiveAt: new Date() });

  if (foundUser.twoFAEnable && foundUser.twoFAEnable > 0) {
    return {
      appUserId: foundUser.appUserId,
      twoFAEnable: foundUser.twoFAEnable
    };
  } else {
    return foundUser;
  }
}

async function loginFacebook(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.payload.facebook_id && req.payload.facebook_id !== "" && req.payload.facebook_id !== null) {
        let userName = "FB_" + req.payload.facebook_id;
        let password = req.payload.facebook_id;
        let avatar = req.payload.facebook_avatar;
        let email = req.payload.facebook_email;
        let firstName = req.payload.facebook_name;

        let loginResult = _loginSocial(userName, password, firstName, email, avatar, req.payload);
        if (loginResult) {
          resolve(loginResult);
        } else {
          reject("failed");
        }
      } else {
        reject("failed");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function loginGoogle(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.payload.google_id && req.payload.google_id !== "" && req.payload.google_id !== null) {
        let userName = "GOOGLE_" + req.payload.google_id;
        let password = req.payload.google_id;
        let avatar = req.payload.google_avatar;
        let email = req.payload.google_email;
        let firstName = req.payload.google_name;

        let loginResult = _loginSocial(userName, password, firstName, email, avatar, req.payload);
        if (loginResult) {
          resolve(loginResult);
        } else {
          reject("failed");
        }
      } else {
        reject("failed");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function loginApple(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.payload.apple_id && req.payload.apple_id !== "" && req.payload.apple_id !== null) {
        let userName = "APPLE_" + req.payload.apple_id;
        let password = req.payload.apple_id;
        let avatar = req.payload.apple_avatar;
        let email = req.payload.apple_email;
        let firstName = req.payload.apple_name;

        let loginResult = _loginSocial(userName, password, firstName, email, avatar, req.payload);
        if (loginResult) {
          resolve(loginResult);
        } else {
          reject("failed");
        }
      } else {
        reject("failed");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function loginZalo(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.payload.zalo_id && req.payload.zalo_id !== "" && req.payload.zalo_id !== null) {
        let userName = "ZALO_" + req.payload.zalo_id;
        let password = req.payload.zalo_id;
        let avatar = req.payload.zalo_avatar;
        let email = req.payload.zalo_email;
        let firstName = req.payload.zalo_name;

        let loginResult = _loginSocial(userName, password, firstName, email, avatar, req.payload);
        if (loginResult) {
          resolve(loginResult);
        } else {
          reject("failed");
        }
      } else {
        reject("failed");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

module.exports = {
  insert,
  find,
  updateById,
  findById,
  registerUser,
  loginUser,
  resetPasswordUser,
  changePasswordUser,
  verify2FA,
  loginFacebook,
  loginGoogle,
  loginZalo,
  loginApple,
};
