/**
 * Created by A on 7/18/17.
 */
"use strict";

const UserWithdrawTransactionView = require("../resourceAccess/UserWithdrawTransactionView");
const WithdrawTransactionResourceAccess = require("../resourceAccess/WithdrawTransactionResourceAccess");
const WithdrawTransactionUserView = require("../resourceAccess/WithdrawTransactionUserView");
const WithdrawTransactionFunction = require('../WithdrawTransactionFunctions');
const {WITHDRAW_TRX_STATUS} = require('../WithdrawTransactionConstant');


async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = req.currentUser;
      let pointAmount = req.payload.pointAmount;

      let createResult = await WithdrawTransactionFunction.createWithdrawRequest(user, pointAmount);
      if (!createResult) {
        reject("can not create withdraw transaction");
        return;
      }

      if(createResult){
        resolve(createResult);
      } else {
        reject("failed");
      }
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
      
      if (req.currentUser.userAgentId) {
        filter.referId = req.currentUser.userAgentId;
        filter.status = DEPOSIT_TRX_STATUS.COMPLETED;
      }

      let transactionList = await WithdrawTransactionUserView.customSearch(filter, skip, limit, order);
      let transactionCount = await WithdrawTransactionUserView.customCount(filter, order);
      // let transactionSumETH = await UserWithdrawTransactionView.sum('ethAmount' ,{
      //   ...filter,
      //   walletType: "Payment"
      // }, order);
      // let transactionSumETHFee = await UserWithdrawTransactionView.sum('ethGasFee' ,{
      //   ...filter,
      //   walletType: "Payment"
      // }, order);
      // let transactionSumETHGasFee = await UserWithdrawTransactionView.sum('ethFee' ,{
      //   ...filter,
      //   walletType: "Payment"
      // }, order);
      // let transactionSumBIT = await UserWithdrawTransactionView.sum('pointAmount', {
      //   ...filter,
      //   walletType: "Game"
      // }, order);

      if (transactionList && transactionCount && transactionList.length > 0) {
        resolve({
          data: transactionList, 
          total: transactionCount[0].count,
          // totalWithdrawETH: transactionSumETH.length > 0 ? transactionSumETH[0].sumResult : 0,
          // totalWithdraw: transactionSumBIT.length > 0 ? transactionSumBIT[0].sumResult : 0,
          // totalWithdrawETHFee: transactionSumETHFee.length > 0 ? transactionSumETHFee[0].sumResult : 0,
          // totalWithdrawETHGasFee: transactionSumETHGasFee.length > 0 ? transactionSumETHGasFee[0].sumResult : 0,
        });
      }else{
        resolve({
          data: [], 
          total: 0,
          // totalWithdrawETH: 0,
          // totalWithdraw: 0,
          // totalWithdrawETHFee: 0,
          // totalWithdrawETHGasFee: 0,
        });
      }
      resolve("success");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let newStatus = req.payload.data.status;
      let result = undefined;
      console.log(newStatus);
      if(newStatus === WITHDRAW_TRX_STATUS.COMPLETED){
        result = await WithdrawTransactionFunction.acceptWithdrawRequest(req.payload.id);
      }else{
        result = await WithdrawTransactionFunction.rejectWithdrawRequest(req.payload.id)
      }

      if(result) {
        resolve(result);
      }else{
        reject("update transaction failed");
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
      let transactionList = await WithdrawTransactionUserView.find({withdrawTransactionId: req.payload.id});
      if(transactionList) {
        resolve(transactionList[0]);
      }else{
        resolve({});
      }
      resolve("success");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};
async function findByUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      
      if (req.currentUser.userId) {
        filter.userId = req.currentUser.userId;
      } else {
        reject("failed");
        return;
      }

      let transactionList = await WithdrawTransactionUserView.find(filter, skip, limit, order);
      let transactionCount = await WithdrawTransactionUserView.count(filter, order);

      if (transactionList && transactionCount && transactionList.length > 0) {
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
      console.error(e);
      reject("failed");
    }
  });
};

async function staffAcceptRequest(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await WithdrawTransactionFunction.acceptWithdrawRequest(req.payload.id);
      if(result) {
        resolve(result);
      }else{
        reject("failed");
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function staffRejectRequest(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await WithdrawTransactionFunction.rejectWithdrawRequest(req.payload.id);
      if(result) {
        resolve(result);
      }else{
        reject("failed");
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};


async function summaryUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let filter = req.payload.filter;
      filter.userId = req.currentUser.userId;

      let result = await WithdrawTransactionResourceAccess.sumaryPointAmount(startDate, endDate, filter);
      if(result) {
        resolve(result[0]);
      }else{
        reject("failed");
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function summaryAll(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let filter = req.payload.filter;

      let result = await WithdrawTransactionResourceAccess.sumaryPointAmount(startDate, endDate, filter);
      if(result) {
        resolve(result[0]);
      }else{
        reject("failed");
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

module.exports = {
  insert,
  find,
  updateById,
  findById,
  findByUser,
  staffRejectRequest,
  staffAcceptRequest,
  summaryAll,
  summaryUser,
};
