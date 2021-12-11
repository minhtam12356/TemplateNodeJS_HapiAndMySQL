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
          table.integer('twoFAEnable').defaultTo(0);
          table.string('userAvatar');
          table.string('socialInfo');
          table.integer('stationsId');
          table.integer('active').defaultTo(1);
          table.integer('appUserRoleId').defaultTo(0);
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.unique('username');
          table.index('username');
          table.index('firstName');
          table.index('lastName');
          table.index('active');
          table.index('phoneNumber');
          table.index('lastActiveAt');
          table.index('appUserRoleId');
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

function _makeQueryBuilderByFilter(filter, skip, limit, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('username', 'like', `%${searchText}%`)
        .orWhere('firstName', 'like', `%${searchText}%`)
        .orWhere('lastName', 'like', `%${searchText}%`)
        .orWhere('phoneNumber', 'like', `%${searchText}%`)
        .orWhere('email', 'like', `%${searchText}%`)
    })
  } else {
    if (filterData.username) {
      queryBuilder.where('username', 'like', `%${filterData.username}%`)
      delete filterData.username;
    }

    if (filterData.firstName) {
      queryBuilder.where('firstName', 'like', `%${filterData.firstName}%`)
      delete filterData.firstName;
    }

    if (filterData.lastName) {
      queryBuilder.where('lastName', 'like', `%${filterData.lastName}%`)
      delete filterData.lastName;
    }

    if (filterData.phoneNumber) {
      queryBuilder.where('phoneNumber', 'like', `%${filterData.phoneNumber}%`)
      delete filterData.phoneNumber;
    }

    if (filterData.email) {
      queryBuilder.where('email', 'like', `%${filterData.email}%`)
      delete filterData.email;
    }
  }

  queryBuilder.where(filterData);

  queryBuilder.where({ isDeleted: 0 });

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }

  if (order && order.key !== '' && order.value !== '' && (order.value === 'desc' || order.value === 'asc')) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy("createdAt", "desc")
  }

  return queryBuilder;
}
async function customSearch(filter, skip, limit, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, searchText, order);
  return await query.select();
}
async function customCount(filter, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, searchText, order);
  return new Promise((resolve, reject) => {
    try {
      query.count(`${primaryKeyField} as count`)
        .then(records => {
          resolve(records[0].count);
        });
    } catch (e) {
      Logger.error("ResourceAccess", `DB COUNT ERROR: ${tableName} : ${JSON.stringify(filter)} - ${JSON.stringify(order)}`);
      Logger.error("ResourceAccess", e);
      reject(undefined);
    }
  });
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  updateAll,
  modelName: tableName,
  customSearch,
  customCount,
};
