"use strict";
require("dotenv").config();
const { DB } = require("../../../config/database")
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "MessageCustomerView";
const rootTableName = 'MessageCustomer';
const primaryKeyField = "messageCustomerId";

async function createRoleStaffView() {
  const CustomerMessageTable = 'CustomerMessage';

  let fields = [
    `${rootTableName}.messageCustomerId`,
    `${rootTableName}.customerId`,
    `${rootTableName}.messageId`,
    `${rootTableName}.customerScheduleId`,
    `${rootTableName}.customerStationId`,
    `${rootTableName}.messageSendStatus`,
    `${rootTableName}.customerMessagePhone`,
    `${rootTableName}.customerMessageEmail`,
    `${rootTableName}.customerMessagePlateNumber`,
    `${rootTableName}.messageNote`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.updatedAt`,
    `${rootTableName}.isHidden`,
    `${CustomerMessageTable}.customerMessageCategories`,
    `${CustomerMessageTable}.customerMessageContent`,
    `${CustomerMessageTable}.customerMessageTitle`,
    `${CustomerMessageTable}.customerMessageTemplateId`,
  ];

  var viewDefinition = DB.select(fields).from(rootTableName).leftJoin(CustomerMessageTable, function () {
    this.on(`${rootTableName}.messageId`, '=', `${CustomerMessageTable}.customerMessageId`);
  });

  Common.createOrReplaceView(tableName, viewDefinition)
}

async function initViews() {
  createRoleStaffView();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  return await Common.updateById(tableName, { userId: id }, data);
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
  initViews,
  updateAll,
};
