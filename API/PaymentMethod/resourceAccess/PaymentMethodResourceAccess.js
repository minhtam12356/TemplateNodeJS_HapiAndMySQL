"use strict";
require("dotenv").config();

// Import
const Logger = require('../../../utils/logging');
const { DB, timestamps } = require("../../../config/database")
const Common = require('../../Common/resourceAccess/CommonResourceAccess');

// Table Constant
const tableName = "PaymentMethod";
const primaryKeyField = "paymentMethodId";

// Function Block
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);

  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(tableName).then(() => {
      DB.schema.createTable(tableName, (table) => {
        table.increments(primaryKeyField).primary();
        table.string('paymentMethodName');
        timestamps(table)
      })
      .then(async () => {
        Logger.info(`${tableName}`, `${tableName} table created done`);
        let methods = [
          "Ví MOMO",
          "Cổng VNPAY",
          "Thẻ ATM / Thẻ nội địa / Ngân hàng",
          "Thẻ Visa / Master / Credit / Debit",
        ];
        let methodsArr = [];
        for (let i = 0; i < methods.length; i++) {
          const methodName = methods[i];
          methodsArr.push({
            paymentMethodName: methodName,
          });
        }
        DB(`${tableName}`).insert(methodsArr).then((result) => {
          Logger.info(`${tableName}`, `init ${tableName}` + result);
          resolve();
        });
      });
    })
  })
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

async function deleteById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;

  return await Common.deleteById(tableName, dataId, data)
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order)
}

module.exports = {
  insert,
  deleteById,
  updateById,
  find,
  initDB,
  modelName: tableName
};