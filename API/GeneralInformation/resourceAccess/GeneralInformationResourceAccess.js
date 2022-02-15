/**
 * Created by Huu on 11/18/21.
 */

"use strict";
require("dotenv").config();

const Logger = require("../../../utils/logging");
const { DB, timestamps } = require("../../../config/database");
const Common = require("../../Common/resourceAccess/CommonResourceAccess");
const tableName = "GeneralInformation";
const primaryKeyField = "generalInformationId";
async function createTable() {
  Logger.info("ResourceAccess", `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.text("aboutUs", 10000).defaultTo('aboutUs');
          table.text("questionAndAnwser", 10000).defaultTo('FAQ');
          table.text("generalRule", 10000).defaultTo('generalRule');
          table.text("appPolicy", 10000).defaultTo('appPolicy');
          timestamps(table);
          table.index(`${primaryKeyField}`);
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          seeding().then(() => {
            resolve();
          })
        });
    });
  });
}

async function seeding() {
  let dataDefault = [
    {
      aboutUs: null,
      questionAndAnwser: null,
      generalRule: null
    }
  ];
  return new Promise(async (resolve, reject) => {
    DB(`${tableName}`).insert(dataDefault).then((result) => {
      Logger.info(`${tableName}`, `seeding ${tableName}` + result);
      resolve();
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

module.exports = {
  insert,
  find,
  updateById,
  initDB,
};
