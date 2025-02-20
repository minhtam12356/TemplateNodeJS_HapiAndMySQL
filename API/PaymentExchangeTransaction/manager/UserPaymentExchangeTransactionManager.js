/**
 * Created by A on 7/18/17.
 */
"use strict";

const ExchangeTransactionResourceAccess = require("../resourceAccess/PaymentExchangeTransactionResourceAccess");
const ExchangeTransactionUserView = require("../resourceAccess/ExchangeTransactionUserView");
const ExchangeTransactionFunction = require('../PaymentExchangeTransactionFunctions');
const AppUserFunctions = require('../../AppUsers/AppUsersFunctions');
const { USER_ERROR } = require('../../AppUsers/AppUserConstant');
const { EXCHANGE_TRX_STATUS, EXCHANGE_ERROR } = require('../PaymentExchangeTransactionConstant');
const Logger = require('../../../utils/logging');


async function userExchangeHistory(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      if (req.currentUser.appUserId) {
        filter.appUserId = req.currentUser.appUserId;
      } else {
        reject("failed");
        return;
      }

      let transactionList = await ExchangeTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, undefined, order);

      if (transactionList && transactionList.length > 0) {
        let transactionCount = await ExchangeTransactionUserView.customCount(filter, startDate, endDate, undefined, order);
        resolve({
          data: transactionList, 
          total: transactionCount[0].count,
        });
      }else{
        resolve({
          data: [], 
          total: 0,
        });
      }
      resolve("success");
    } catch (e) {
      Logger.error(e);
      reject("failed");
    }
  });
};

async function userReceiveHistory(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;

      filter.receiveWalletId = req.currentUser.appUserId;
      filter.paymentStatus = EXCHANGE_TRX_STATUS.COMPLETED;

      let transactionList = await ExchangeTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, undefined, order);

      if (transactionList && transactionList.length > 0) {
        let transactionCount = await ExchangeTransactionUserView.customCount(filter, startDate, endDate, undefined, order);
        resolve({
          data: transactionList, 
          total: transactionCount[0].count,
        });
      }else{
        resolve({
          data: [], 
          total: 0,
        });
      }
      resolve("success");
    } catch (e) {
      Logger.error(e);
      reject("failed");
    }
  });
};

async function userViewExchangeRequests(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      if (req.currentUser.appUserId) {
        filter.referId = req.currentUser.appUserId;
      } else {
        reject("failed");
        return;
      }

      filter.paymentStatus = EXCHANGE_TRX_STATUS.NEW;

      let transactionList = await ExchangeTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, undefined, order);

      if (transactionList && transactionList.length > 0) {
        let transactionCount = await ExchangeTransactionUserView.customCount(filter, startDate, endDate, undefined, order);
        resolve({
          data: transactionList, 
          total: transactionCount[0].count,
        });
      }else{
        resolve({
          data: [], 
          total: 0,
        });
      }
      resolve("success");
    } catch (e) {
      Logger.error(e);
      reject("failed");
    }
  });
};

async function userRequestExchange(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentAmount = req.payload.paymentAmount;
      let walletBalanceUnitId = req.payload.walletBalanceUnitId;
      
      //if system support for secondary password
      if (req.payload.secondaryPassword) {
        let verifyResult = await AppUserFunctions.verifyUserSecondaryPassword(req.currentUser.username, req.payload.secondaryPassword);
        if (verifyResult === undefined) {
          Logger.error(`${USER_ERROR.NOT_AUTHORIZED} ExchangeTransactionFunction.createExchangeRequest`);
          reject(USER_ERROR.NOT_AUTHORIZED);
          return;
        }
      }

      let createResult = await ExchangeTransactionFunction.createExchangeRequest(req.currentUser, paymentAmount, walletBalanceUnitId);
      if (createResult) {
        resolve(createResult);
      } else {
        Logger.error(`can not ExchangeTransactionFunction.createExchangeRequest`);
        reject("can not create exchange transaction");
      }
    } catch (e) {
      Logger.error(e);
      if (e === EXCHANGE_ERROR.NOT_ENOUGH_BALANCE) {
        reject(EXCHANGE_ERROR.NOT_ENOUGH_BALANCE);
      } else {
        reject("failed");
      }
    }
  });
};

async function userAcceptExchangeRequest(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await ExchangeTransactionFunction.userAcceptExchangeRequest(req.payload.id, req.currentUser);
      if(result) {
        resolve(result);
      }else{
        reject("failed");
      }
    } catch (e) {
      Logger.error(e);
      reject("failed");
    }
  });
};

async function userDenyExchangeRequest(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await ExchangeTransactionFunction.userRejectExchangeRequest(req.payload.id, req.currentUser);
      if(result) {
        resolve(result);
      }else{
        reject("failed");
      }
    } catch (e) {
      Logger.error(e);
      reject("failed");
    }
  });
};

async function userCancelExchangeRequest(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await ExchangeTransactionFunction.userCancelExchangeRequest(req.payload.id, req.currentUser);
      if(result) {
        resolve(result);
      }else{
        reject("failed");
      }
    } catch (e) {
      Logger.error(e);
      reject("failed");
    }
  });
};

module.exports = {
  userRequestExchange,
  userExchangeHistory,
  userReceiveHistory,
  userDenyExchangeRequest,
  userCancelExchangeRequest,
  userAcceptExchangeRequest,
  userViewExchangeRequests,
};
