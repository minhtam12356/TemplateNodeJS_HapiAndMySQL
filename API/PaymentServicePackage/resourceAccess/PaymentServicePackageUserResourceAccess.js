"use strict";
require("dotenv").config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "PaymentServicePackageUser";
const primaryKeyField = "paymentServicePackageUserId";
const { ACTIVITY_STATUS } = require('../PaymentServicePackageConstant');

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.integer('appUserId'); //<< User nguoi mua
          table.integer('paymentServicePackageId'); //<< goi cuoc 
          table.timestamp('packageExpireDate', { useTz: true }).defaultTo(DB.fn.now()); // << ngay het han
          table.timestamp('packageLastActiveDate',{ useTz: true }).defaultTo(DB.fn.now());
          table.integer('packageActivityStatus').defaultTo(ACTIVITY_STATUS.WORKING); // << tinh trang hoat dong cua package
          table.double('packagePrice'); // << gia mua package tai thoi diem do
          table.double('packageDiscountPrice').nullable(); // << gia mua khuyen mai cua package tai thoi diem do
          table.double('packagePaymentAmount').nullable(); // << gia mua khuyen mai cua package tai thoi diem do
          table.double('profitEstimate').defaultTo(0); // << loi nhuan du kien
          table.double('profitActual').defaultTo(0); // << loi nhuan du kien
          table.double('profitClaimed').defaultTo(0); // << loi nhuan du kien
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index(`appUserId`);
          table.index(`paymentServicePackageId`);
          table.index(`packageExpireDate`);
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          seeding().then(() => {
            resolve();
          });
        });
    });
  });
}

async function seeding() {
  return new Promise(async (resolve, reject) => {
    resolve();
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
async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}
async function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.deleteById(tableName, dataId)
}

async function customSum(filter, startDate, endDate) {
  const _field = 'paymentAmount';

  let queryBuilder = DB(tableName);
  if (startDate) {
    DB.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    DB.where('createdAt', '<=', endDate);
  }

  if (filter.referAgentId) {
    DB.where('referId', referAgentId);
  }

  DB.where({
    status: WITHDRAW_TRX_STATUS.COMPLETED
  });

  return new Promise((resolve, reject) => {
    try {
      queryBuilder.sum(`${_field} as sumResult`)
        .then(records => {
          if (records && records[0].sumResult === null) {
            resolve(undefined)
          } else {
            resolve(records);
          }
        });
    }
    catch (e) {
      Logger.error("ResourceAccess", `DB SUM ERROR: ${tableName} ${field}: ${JSON.stringify(filter)}`);
      Logger.error("ResourceAccess", e);
      reject(undefined);
    }
  });
}

async function sumAmountDistinctByDate(filter, startDate, endDate) {
  return await Common.sumAmountDistinctByDate(tableName, 'paymentAmount', filter, startDate, endDate);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  findById,
  deleteById,
  initDB,
  customSum,
  sumAmountDistinctByDate
};
