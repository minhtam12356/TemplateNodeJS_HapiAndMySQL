"use strict";
require("dotenv").config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "SystemConfiguration";
const primaryKeyField = "systemConfigurationId";
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('telegramGroupUrl').defaultTo(''); // link group telegram
          table.string('fbMessengerUrl').defaultTo(''); // link messenger FB
          table.string('zaloUrl').defaultTo(''); //link zalo OA
          table.string('playStoreUrl').defaultTo(''); //link play store
          table.string('appStoreUrl').defaultTo(''); //link app store
          table.string('websiteUrl').defaultTo(''); // website chinh
          table.string('hotlineNumber').defaultTo(''); //hotline
          table.string('address').defaultTo(''); //dia chi cong ty
          table.string('systemVersion').defaultTo('1.0.0'); //dia chi cong ty
          table.double('exchangeVNDPrice').defaultTo(23000); //gia quy doi USD - VND 
          timestamps(table);
          table.index(`${primaryKeyField}`);
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
  let projectStatus = [
    {
      systemVersion: '1.0.0', 
    },
  ];
  return new Promise(async (resolve, reject) => {
    DB(`${tableName}`).insert(projectStatus).then((result) => {
      Logger.info(`${tableName}`, `seeding ${tableName}` + result);
      resolve();
    });
  });
}

async function initDB() {
  await createTable();
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
  find,
  updateById,
  initDB
};
