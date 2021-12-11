"use strict";
require("dotenv").config();
const { DB, timestamps } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { WITHDRAW_TRX_STATUS } = require('../WithdrawTransactionConstant');
const tableName = "WithdrawTransaction";
const primaryKeyField = "withdrawTransactionId";
async function createTable() {
  console.log(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('withdrawTransactionId').primary();
          table.integer('userId');
          table.integer('walletId');
          table.integer('referId');
          table.float('pointAmount', 48, 24).defaultTo(0);
          table.float('ethPrice', 48, 24).defaultTo(0);
          table.float('ethAmount', 48, 24).defaultTo(0);
          table.string('status').defaultTo(WITHDRAW_TRX_STATUS.NEW);
          table.float('ethBegin', 48, 24).notNullable();
          table.float('ethEnd', 48, 24).notNullable();
          table.float('pointBegin', 48, 24).notNullable();
          table.float('pointEnd', 48, 24).notNullable();
          table.string('hash').defaultTo('');
          table.string('walletAddress').defaultTo('');
          table.string('walletType').defaultTo('');
          table.float('ethFee', 48, 24).defaultTo(0);
          table.float('ethGasFee', 48, 24).defaultTo(0);
          table.float('otherFee', 48, 24).defaultTo(0);
          table.string('note').defaultTo('');
          table.string('fromWalletAddress').defaultTo('');
          table.string('ethGasUsed', 48, 24).defaultTo(0);
          table.integer('confirmations');
          table.string('blockHash').defaultTo('');
          table.string('blockNumber').defaultTo('');
          table.string('timeStamp').defaultTo('');
          table.string('transactionIndex').defaultTo('');
          table.string('sotaikhoan').defaultTo('');
          table.string('tentaikhoan').defaultTo('');
          table.string('tennganhang').defaultTo('');
          timestamps(table);
          table.index('userId');
          table.index('walletId');
          table.index('pointAmount');
          table.index('ethPrice');
          table.index('ethAmount');
          table.index('status');
          table.index('ethBegin');
          table.index('ethEnd');
          table.index('pointBegin');
          table.index('pointEnd');
          table.index('hash');
          table.index('walletAddress');
          table.index('walletType');
          table.index('ethFee');
          table.index('ethGasFee');
          table.index('otherFee');
        })
        .then(() => {
          console.log(`${tableName} table created done`);
          resolve();
        });
    });
  });
}

async function initDB() {
  await createTable();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.updateById(tableName, dataId, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function sumaryPointAmount(startDate, endDate, referAgentId) {
  let sumField = 'pointAmount';
  let queryBuilder = DB(tableName);
  if (startDate) {
    DB.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    DB.where('createdAt', '<=', endDate);
  }

  if (referAgentId) {
    DB.where('referId', referAgentId);
  }

  DB.where({
    status: WITHDRAW_TRX_STATUS.COMPLETED
  });

  return new Promise((resolve, reject) => {
    try {
      queryBuilder.sum(`${sumField} as sumResult`)
        .then(records => {
          resolve(records);
        });
    }
    catch (e) {
      console.log(e)
      reject(-1);
    }
  });
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  sumaryPointAmount,
};
