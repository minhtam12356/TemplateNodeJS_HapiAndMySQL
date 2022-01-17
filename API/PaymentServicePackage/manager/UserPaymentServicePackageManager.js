/**
 * Created by A on 7/18/17.
 */
"use strict";
const ServicePackageWalletViews = require("../resourceAccess/ServicePackageWalletViews");
const UserServicePackageViews = require('../resourceAccess/UserServicePackageViews')
const UserServicePackageFunctions = require('../UserServicePackageFunctions');
const AppUserFunctions = require('../../AppUsers/AppUsersFunctions');
const { USER_ERROR } = require('../../AppUsers/AppUserConstant');
const Logger = require('../../../utils/logging');
const MINING_DURATION = require('../PaymentServicePackageConstant').MINING_DURATION;

async function getListUserBuyPackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let order = req.payload.order;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let searchText = req.payload.searchText;

      if (filter === undefined) {
        filter = {};
      }

      let packages = await UserServicePackageViews.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      
      if (packages && packages.length > 0) {
        let packagesCount = await UserServicePackageViews.customCount(filter, skip, limit, startDate, endDate, searchText, order);
        resolve({ data: packages, total: packagesCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function historyServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let order = req.payload.order;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let searchText = req.payload.searchText;

      if (filter === undefined) {
        filter = {};
      }

      filter.appUserId = req.currentUser.appUserId;

      let distinctFields = [
        `walletBalanceUnitId`,
        `walletBalanceUnitDisplayName`,
        `walletBalanceUnitCode`,
        `walletBalanceUnitAvatar`,
        `userSellPrice`,
        `agencySellPrice`,
        `balance`,
      ];
      let packages = await ServicePackageWalletViews.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      
      if (packages && packages.length > 0) {
        for (let i = 0; i < packages.length; i++) {
          const _package = packages[i];

          //get time diff in milisecond
          let _timeDiff = (new Date() - 1) - (new Date(_package.packageLastActiveDate) - 1);
          packages[i].processing = parseInt(_timeDiff / (MINING_DURATION * 60 * 60 * 1000) * 100);

          //maximum 100% processing
          packages[i].processing = Math.min(packages[i].processing, 100);
        }
        let packagesCount = await ServicePackageWalletViews.customCount(filter, skip, limit, startDate, endDate, searchText, order);
        resolve({ data: packages, total: packagesCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function getUserServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let order = req.payload.order;

      if (filter === undefined) {
        filter = {};
      }

      filter.appUserId = req.currentUser.appUserId;

      let distinctFields = [
        `walletBalanceUnitId`,
        `walletBalanceUnitDisplayName`,
        `walletBalanceUnitCode`,
        `walletBalanceUnitAvatar`,
        `userSellPrice`,
        `agencySellPrice`,
        `balance`,
      ];
      let packages = await ServicePackageWalletViews.customSumCountDistinct(distinctFields ,filter, startDate, endDate);
      
      if (packages && packages.length > 0) {
        for (let packagesCounter = 0; packagesCounter < packages.length; packagesCounter++) {
          const userPackage = packages[packagesCounter];
          packages[packagesCounter].packagePerformance = userPackage.totalSum;
        }
        resolve({ data: packages, total: packages.length });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function buyServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentServicePackageId = req.payload.paymentServicePackageId;
      let currentUser = req.currentUser;

      //if system support for secondary password
      if (req.payload.secondaryPassword) {
        let verifyResult = await AppUserFunctions.verifyUserSecondaryPassword(req.currentUser.username, req.payload.secondaryPassword);
        if (verifyResult === undefined) {
          Logger.error(`${USER_ERROR.NOT_AUTHORIZED} requestWithdraw`);
          reject(USER_ERROR.NOT_AUTHORIZED);
          return;
        }
      }
      
      let result = await UserServicePackageFunctions.userBuyServicePackage(currentUser, paymentServicePackageId);
      if (result) {
        resolve(result);
      } else {
        reject("failed");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function userGetBalanceByUnitId(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      let packages = await ServicePackageWalletViews.find(filter, skip, limit, order);
      
      if (packages && packages.length > 0) {
        let paymentServiceCount = await ServicePackageWalletViews.count(filter, order);
        resolve({ data: packages, total: paymentServiceCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};


async function userActivateServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentServicePackageUserId = req.payload.paymentServicePackageUserId;
      let currentUser = req.currentUser;

      let result = await UserServicePackageFunctions.userActivateServicePackage(currentUser, paymentServicePackageUserId);
      if (result) {
        resolve(result);
      } else {
        reject("failed");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};


async function userCollectServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentServicePackageUserId = req.payload.paymentServicePackageUserId;
      let currentUser = req.currentUser;

      let result = await UserServicePackageFunctions.userCollectServicePackage(currentUser, paymentServicePackageUserId);
      if (result) {
        resolve(result);
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
  historyServicePackage,
  buyServicePackage,
  userGetBalanceByUnitId,
  getUserServicePackage,
  userCollectServicePackage,
  userActivateServicePackage,
  getListUserBuyPackage
};