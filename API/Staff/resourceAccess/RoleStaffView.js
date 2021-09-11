"use strict";
require("dotenv").config();
const { DB } = require("../../../config/database")
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "RoleStaffView";
const rootTableName = 'Staff';
const primaryKeyField = "staffId";

async function createRoleStaffView() {
  const RoleTableName = 'Role';
  let fields = [
    `${rootTableName}.staffId`,
    `${rootTableName}.roleId`,
    `${rootTableName}.username`,
    `${rootTableName}.firstName`,
    `${rootTableName}.lastName`,
    `${rootTableName}.email`,
    `${rootTableName}.password`,
    `${rootTableName}.active`,
    `${rootTableName}.ipAddress`,
    `${rootTableName}.phoneNumber`,
    `${rootTableName}.lastActiveAt`,
    `${rootTableName}.twoFACode`,
    `${rootTableName}.telegramId`,
    `${rootTableName}.facebookId`,
    `${rootTableName}.appleId`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.isDeleted`,
    `${RoleTableName}.roleName`,
    `${RoleTableName}.permissions`,
  ];

  var viewDefinition = DB.select(fields).from(rootTableName).leftJoin(RoleTableName, function () {
    this.on(`${rootTableName}.roleId`, '=', `${RoleTableName}.roleId`);
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
