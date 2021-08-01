"use strict";
require("dotenv").config();
const { DB, timestamps } = require("../../config/database");

function createOrReplaceView(viewName, viewDefinition) {
  console.log("createOrReplaceView: " + viewName);
  console.log(viewDefinition.toString());
  return DB.schema.raw('CREATE OR REPLACE VIEW ?? AS (\n' + viewDefinition + '\n)', [viewName]).then(() => {
    console.log("[DONE]createOrReplaceView: " + viewName);
  });
}

async function insert(tableName, data) {
  let result = undefined;
  try {
    result = await DB(tableName).insert(data);
  } catch (e) {
    console.error(`DB INSERT ERROR: ${tableName} : ${JSON.stringify(data)}`);
    console.error(e);
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
      console.error(`DB SUM ERROR: ${tableName} ${field}: ${JSON.stringify(filter)} - ${skip} - ${limit} ${JSON.stringify(order)}`);
      console.error(e);
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
    console.error(`DB UPDATEBYID ERROR: ${tableName} : ${id} - ${JSON.stringify(data)}`);
    console.error(e);
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
    console.error(`DB UPDATEALL ERROR: ${tableName} : ${filter} - ${JSON.stringify(data)}`);
    console.error(e);
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
      console.error(`DB FIND ERROR: ${tableName} : ${JSON.stringify(filter)} - ${skip} - ${limit} ${JSON.stringify(order)}`);
      console.error(e);
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
      console.error(`DB COUNT ERROR: ${tableName} : ${JSON.stringify(filter)} - ${JSON.stringify(order)}`);
      console.error(e);
      reject(undefined);
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  count,
  createOrReplaceView,
  updateAll,
  sum
};
