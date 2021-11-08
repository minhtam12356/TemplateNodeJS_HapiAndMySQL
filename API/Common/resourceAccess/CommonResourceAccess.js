"use strict";
require("dotenv").config();

const Logger = require('../../../utils/logging');
const { DB } = require("../../../config/database");

function createOrReplaceView(viewName, viewDefinition) {
  Logger.info("ResourceAccess", "createOrReplaceView: " + viewName);
  Logger.info("ResourceAccess", viewDefinition.toString());
  return DB.schema.raw('CREATE OR REPLACE VIEW ?? AS (\n' + viewDefinition + '\n)', [viewName]).then(() => {
    Logger.info("ResourceAccess", "[DONE]createOrReplaceView: " + viewName);
  });
}

async function insert(tableName, data) {
  let result = undefined;
  try {
    result = await DB(tableName).insert(data);
  } catch (e) {
    Logger.error("ResourceAccess", `DB INSERT ERROR: ${tableName} : ${JSON.stringify(data)}`);
    Logger.error("ResourceAccess", e);
  }

  return result;
}
async function sum(tableName, field, filter, order){
  let queryBuilder = _makeQueryBuilderByFilter(tableName, filter, undefined, undefined, order)

  return new Promise((resolve, reject) => {
    try {
      queryBuilder.sum(`${field} as sumResult`)
        .then(records => {
          resolve(records);
        });
    } catch (e) {
      Logger.error("ResourceAccess", `DB SUM ERROR: ${tableName} ${field}: ${JSON.stringify(filter)} - ${skip} - ${limit} ${JSON.stringify(order)}`);
      Logger.error("ResourceAccess", e);
      reject(undefined);
    }
  });
}
async function updateById(tableName, id, data) {
  let result = undefined;
  try {
    result = await DB(tableName)
      .where(id)
      .update(data);
  } catch (e) {
    Logger.error("ResourceAccess", `DB UPDATEBYID ERROR: ${tableName} : ${id} - ${JSON.stringify(data)}`);
    Logger.error("ResourceAccess", e);
  }
  return result;
}

async function updateAll(tableName, data, filter = {}) {
  let result = undefined;

  try {
    result = await DB(tableName)
      .where(filter)
      .update(data);
  } catch (e) {
    Logger.error("ResourceAccess", `DB UPDATEALL ERROR: ${tableName} : ${filter} - ${JSON.stringify(data)}`);
    Logger.error("ResourceAccess", e);
  }
  return result;
}

function _makeQueryBuilderByFilter(tableName, filter, skip, limit, order) {
  let queryBuilder = DB(tableName);
  if(filter){
    queryBuilder.where(filter);
  }

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }

  queryBuilder.where({isDeleted: 0});

  if (order && order.key !== '' && order.value !== '' && (order.value === 'desc' || order.value === 'asc')) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy("createdAt", "desc")
  }

  return queryBuilder;
}

async function find(tableName, filter, skip, limit, order) {
  let queryBuilder = _makeQueryBuilderByFilter(tableName, filter, skip, limit, order)
  return new Promise((resolve, reject) => {
    try {
      queryBuilder.select()
        .then(records => {
          resolve(records);
        });
    } catch (e) {
      Logger.error("ResourceAccess", `DB FIND ERROR: ${tableName} : ${JSON.stringify(filter)} - ${skip} - ${limit} ${JSON.stringify(order)}`);
      Logger.error("ResourceAccess", e);
      reject(undefined);
    }
  });
}

async function findById(tableName, key, id) {
  return new Promise((resolve, reject) => {
    try {
      DB(tableName).select().where(key, id)
        .then(records => {
          if(records && records.length > 0) {
            resolve(records[0]);
          }else {
            resolve(undefined);
          }
        });
    } catch (e) {
      Logger.error("ResourceAccess", `DB FIND ERROR: findById ${tableName} : ${key} - ${id}`);
      Logger.error("ResourceAccess", e);
      reject(undefined);
    }
  });
}

async function count(tableName, field, filter, order) {
  let queryBuilder = _makeQueryBuilderByFilter(tableName, filter, undefined, undefined, order)

  return new Promise((resolve, reject) => {
    try {
      queryBuilder.count(`${field} as count`)
        .then(records => {
          resolve(records);
        });
    } catch (e) {
      Logger.error("ResourceAccess", `DB COUNT ERROR: ${tableName} : ${JSON.stringify(filter)} - ${JSON.stringify(order)}`);
      Logger.error("ResourceAccess", e);
      reject(undefined);
    }
  });
}

async function deleteById(tableName, id) {
  let result = undefined;
  try {
    result = await DB(tableName)
      .where(id)
      .update({isDeleted:1});
  } catch (e) {
    Logger.error("ResourceAccess", `DB UPDATEBYID ERROR: ${tableName} : ${id}`);
    Logger.error("ResourceAccess", e);
  }
  return result;
}

module.exports = {
  insert,
  find,
  findById,
  updateById,
  count,
  createOrReplaceView,
  updateAll,
  sum,
  deleteById
};
