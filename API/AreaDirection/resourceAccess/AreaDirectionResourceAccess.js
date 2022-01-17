"use strict";
require("dotenv").config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { nonAccentVietnamese } = require('../../ApiUtils/utilFunctions');
const tableName = "AreaDirection";
const primaryKeyField = "AreaDirectionId";
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('AreaDirectionName');
          table.string('AreaDirectionKey');
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.unique('AreaDirectionKey');
        })
        .then(() => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          const data = [
            "Đông",
            "Tây",
            "Nam",
            "Bắc",
            "Đông Nam",
            "Đông Bắc",
            "Tây Nam",
            "Tây Bắc"
          ]
          const formattedDAta = [];
          for(let i = 0; i < data.length; i++) {
            let obj = {
              "AreaDirectionName": data[i],
              "AreaDirectionKey": nonAccentVietnamese(data[i]).toUpperCase().replace(/\s/ig, '_')
            }
            formattedDAta.push(obj);
          }

          DB(`${tableName}`).insert(formattedDAta).then((result) => {
            Logger.info(`${tableName}`, `init ${tableName}` + result);
            resolve();
          });
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
  initDB
};
