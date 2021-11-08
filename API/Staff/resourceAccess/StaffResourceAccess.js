"use strict";
require("dotenv").config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require("../../../config/database")
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "Staff";
const primaryKeyField = "staffId";
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('staffId').primary();
          table.string('username');
          table.string('lastName');
          table.string('firstName');
          table.string('email');
          table.integer('roleId');
          table.string('password');
          table.string('active').defaultTo(1);
          table.string('ipAddress');
          table.string('phoneNumber');
          table.string('lastActiveAt');
          table.string('twoFACode');
          table.string('telegramId');
          table.string('facebookId');
          table.string('appleId');
          timestamps(table);
          table.index('staffId');
          table.unique('username');
          table.unique('email');
          table.index('username');
          table.index('firstName');
          table.index('lastName');
          table.index('email');
          table.index('password');
          table.index('active');
          table.index('ipAddress');
          table.index('phoneNumber');
          table.index('lastActiveAt');
          table.index('twoFACode');
        })
        .then(() => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
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
  modelName: tableName
};
