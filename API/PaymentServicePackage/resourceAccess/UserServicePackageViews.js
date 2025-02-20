"use strict";
require("dotenv").config();
const { DB } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const Logger = require('../../../utils/logging');

const tableName = "UserServicePackageViews";
const rootTableName = 'PaymentServicePackageUser';
const primaryKeyField = "paymentServicePackageUserId";

async function createView() {
  const UserTableName = 'AppUser';
  const PaymentServicePackageTable = 'PaymentServicePackage';
  const WalletBalanceUnitTable = "WalletBalanceUnit";

  let fields = [
    `${primaryKeyField}`,
    `${rootTableName}.appUserId`,
    `${rootTableName}.paymentServicePackageId`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.createdAt`,
    DB.raw(`DATE_FORMAT(${rootTableName}.createdAt, "%d-%m-%Y") as createdDate`),
    `${rootTableName}.packageExpireDate`,
    `${rootTableName}.profitEstimate`,
    `${rootTableName}.packagePrice`,
    `${rootTableName}.packageDiscountPrice`,
    `${rootTableName}.packagePaymentAmount`,
    `${rootTableName}.packageActivityStatus`,
    `${rootTableName}.profitActual`,
    `${rootTableName}.profitClaimed`,
    `${rootTableName}.packageLastActiveDate`,
    
    `${UserTableName}.sotaikhoan`,
    `${UserTableName}.tentaikhoan`,
    `${UserTableName}.tennganhang`,
    `${UserTableName}.username`,
    `${UserTableName}.firstName`,
    `${UserTableName}.lastName`,
    `${UserTableName}.email`,
    `${UserTableName}.memberLevelName`,
    `${UserTableName}.active`,
    `${UserTableName}.ipAddress`,
    `${UserTableName}.phoneNumber`,
    `${UserTableName}.telegramId`,
    `${UserTableName}.facebookId`,
    `${UserTableName}.appleId`,
    `${UserTableName}.referUserId`,

    `${PaymentServicePackageTable}.packageName`,
    `${PaymentServicePackageTable}.packagePerformance`,
    `${PaymentServicePackageTable}.packageDuration`,
    `${PaymentServicePackageTable}.packageUnitId`,
    
    `${WalletBalanceUnitTable}.walletBalanceUnitDisplayName`,
    `${WalletBalanceUnitTable}.walletBalanceUnitCode`,
    `${WalletBalanceUnitTable}.walletBalanceUnitAvatar`,
    `${WalletBalanceUnitTable}.originalPrice`,
    `${WalletBalanceUnitTable}.userSellPrice`,
    `${WalletBalanceUnitTable}.agencySellPrice`,
  ];

  var viewDefinition = DB.select(fields).from(rootTableName)
    .leftJoin(UserTableName, function () {
      this.on(`${rootTableName}.appUserId`, '=', `${UserTableName}.appUserId`)
    })
    .leftJoin(PaymentServicePackageTable, function () {
      this.on(`${rootTableName}.paymentServicePackageId`, '=', `${PaymentServicePackageTable}.paymentServicePackageId`);
    })
    .leftJoin(WalletBalanceUnitTable, function () {
      this.on(`${PaymentServicePackageTable}.packageUnitId`, '=', `${WalletBalanceUnitTable}.walletBalanceUnitId`);
    });

  Common.createOrReplaceView(tableName, viewDefinition)
}

async function initViews() {
  createView();
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

async function sum(field, filter, order) {
  return await Common.sum(tableName, field, filter, order);
}

async function sumAmountDistinctByDate(filter, startDate, endDate) {
  return await Common.sumAmountDistinctByDate(tableName, 'packagePaymentAmount', filter, startDate, endDate);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  if (filter === undefined) {
    filter = {};
  }
  let filterData = JSON.parse(JSON.stringify(filter));

  if (searchText) {
    queryBuilder.where('username', 'like', `%${filterData.username}%`)
    queryBuilder.where('lastName', 'like', `%${filterData.lastName}%`)
    queryBuilder.where('firstName', 'like', `%${filterData.firstName}%`)
    queryBuilder.where('email', 'like', `%${filterData.email}%`)
    queryBuilder.where('phoneNumber', 'like', `%${filterData.phoneNumber}%`)
  } else {
    if (filterData.username) {
      queryBuilder.where('username', 'like', `%${filterData.username}%`)
      delete filterData.username;
    }

    if (filterData.lastName) {
      queryBuilder.where('lastName', 'like', `%${filterData.lastName}%`)
      delete filterData.lastName;
    }

    if (filterData.firstName) {
      queryBuilder.where('firstName', 'like', `%${filterData.firstName}%`)
      delete filterData.firstName;
    }

    if (filterData.email) {
      queryBuilder.where('email', 'like', `%${filterData.email}%`)
      delete filterData.email;
    }

    if (filterData.phoneNumber) {
      queryBuilder.where('phoneNumber', 'like', `%${filterData.phoneNumber}%`)
      delete filterData.phoneNumber;
    }
  }

  if (startDate) {
    queryBuilder.where("createdAt", ">=", startDate);
  }
  if (endDate) {
    queryBuilder.where("createdAt", "<=", endDate);
  }

  queryBuilder.where(filterData);

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

async function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}

async function customCount(filter, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, order);
  return await query.count(`${primaryKeyField} as count`);
}

async function customSum(filter, startDate, endDate) {
  const _field = 'packagePaymentAmount';

  let queryBuilder = DB(tableName);
  if (startDate) {
    DB.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    DB.where('createdAt', '<=', endDate);
  }

  if (filter.referAgentId) {
    DB.where('referId', referAgentId);
  }

  return new Promise((resolve, reject) => {
    try {
      queryBuilder.sum(`${_field} as sumResult`)
        .then(records => {
          if (records && records[0].sumResult === null) {
            resolve(undefined)
          } else {
            resolve(records);
          }
        });
    }
    catch (e) {
      Logger.error("ResourceAccess", `DB SUM ERROR: ${tableName} ${field}: ${JSON.stringify(filter)}`);
      Logger.error("ResourceAccess", e);
      reject(undefined);
    }
  });
}

async function customSumCountDistinct(distinctFields, filter, startDate, endDate) {
  const _sumField = 'packagePaymentAmount';

  let queryBuilder = DB(tableName);
  if (startDate) {
    DB.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    DB.where('createdAt', '<=', endDate);
  }

  if (filter.referAgentId) {
    DB.where('referId', referAgentId);
  }

  return new Promise((resolve, reject) => {
    try {
      queryBuilder.sum(`${_sumField} as totalSum`).count(`${_sumField} as totalCount`).select(distinctFields).groupBy(distinctFields)
        .then(records => {
          if (records && records[0].totalCount === null) {
            resolve(undefined)
          } else {
            resolve(records);
          }
        });
    }
    catch (e) {
      Logger.error("ResourceAccess", `DB SUM ERROR: ${tableName} ${distinctFields}: ${JSON.stringify(filter)}`);
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
  initViews,
  sum,
  customSearch,
  customCount,
  customSum,
  customSumCountDistinct,
  sumAmountDistinctByDate,
};
