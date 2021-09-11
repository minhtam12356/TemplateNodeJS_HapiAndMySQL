"use strict";
require("dotenv").config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "AppUser";
const primaryKeyField = "appUserId";
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('username');
          table.string('firstName');
          table.string('lastName');
          table.string('phoneNumber');
          table.string('email');
          table.string('password');
          table.string('lastActiveAt');
          table.string('twoFACode');
          table.string('twoFAQR');
          table.string('userAvatar');
          table.string('socialInfo');
          table.integer('active').defaultTo(1);
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.unique('username');
          table.index('username');
          table.index('firstName');
          table.index('lastName');
          table.index('active');
          table.index('phoneNumber');
          table.index('lastActiveAt');
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
  let filter = {};
  filter[`${primaryKeyField}`] = id;
  return await Common.updateById(tableName, filter, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function updateAll(data, filter) {
  return await Common.updateAll(tableName, data, filter);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  updateAll,
  modelName: tableName
};
