"use strict";
require("dotenv").config();
const { DB, timestamps } = require("../../../config/database")
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { DEPOSIT_TRX_STATUS } = require('../PaymentDepositTransactionConstant');

const tableName = "PaymentDepositTransaction";
const primaryKeyField = "paymentDepositTransactionId";

async function createTable() {
  console.log(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('paymentDepositTransactionId').primary();
          table.integer('appUserId');
          table.integer('walletId');
          table.integer('referId'); // nguoi gioi thieu
          table.integer('paymentMethodId');
          table.float('paymentAmount', 48, 24).defaultTo(0);
          table.float('paymentRewardAmount', 48, 24).defaultTo(0);
          table.string('paymentUnit'); //don vi tien
          table.string('paymentStatus').defaultTo(DEPOSIT_TRX_STATUS.NEW);
          table.string('paymentNote').defaultTo(''); //Ghi chu hoa don
          table.string('paymentRef').defaultTo(''); //Ma hoa don ngoai thuc te
          table.timestamp('paymentApproveDate',{ useTz: true }); // ngay duyet
          table.integer('paymentPICId');  // nguoi duyet
          timestamps(table);
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

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  modelName: tableName,
};
