"use strict";
require("dotenv").config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { STATION_STATUS } = require('../StationsConstants');
const tableName = "Stations";
const primaryKeyField = "stationsId";

function _getDefaultCheckingConfig() {
  let defaultConfig = [
    {
      stepIndex: 0,
      stepLabel: "Nhận xe cuối dây chuyền",
      stepVoice: "Nhận xe cuối dây chuyền",
      stepDuration: 10, //minutes
      stepVoiceUrl: `https://${process.env.HOST_NAME}/uploads/voices/nhan-xe-cuoi-day-chuyen.mp3`
    },
    {
      stepIndex: 1,
      stepLabel: "Nộp phí đường bộ cửa 1",
      stepVoice: "Nộp phí đường bộ cửa 1",
      stepDuration: 10, //minutes
      stepVoiceUrl: `https://${process.env.HOST_NAME}/uploads/voices/nop-phi-duong-bo-cua-1.mp3`
    },
    {
      stepIndex: 2,
      stepLabel: "Nhận giấy tờ xe cửa 2",
      stepVoice: "Nhận giấy tờ xe cửa 2",
      stepDuration: 10, //minutes
      stepVoiceUrl: `https://${process.env.HOST_NAME}/uploads/voices/nhan-giay-to-xe-cua-2.mp3`
    },
    {
      stepIndex: 3,
      stepLabel: "Ra xe, chờ dán tem",
      stepVoice: "Ra xe, chờ dán tem",
      stepDuration: 10, //minutes
      stepVoiceUrl: `https://${process.env.HOST_NAME}/uploads/voices/ra-xe-cho-dan-tem.mp3`
    },
    {
      stepIndex: 4,
      stepLabel: "Trả kết quả kiểm định cửa 4",
      stepVoice: "Trả kết quả kiểm định cửa 4",
      stepDuration: 10, //minutes
      stepVoiceUrl: `https://${process.env.HOST_NAME}/uploads/voices/tra-ket-qua-kiem-dinh-cua-4.mp3`
    }
  ]
  return JSON.stringify(defaultConfig);
}

function _getDefaultBookingConfig() {
  let defaultBookingConfig = [
    {
      index: 0,
      time: "7h-7h30",
      limit: 4
    },
    {
      index: 1,
      time: "7h30-8h",
      limit: 4
    },
    {
      index: 2,
      time: "8h-8h30",
      limit: 4
    },
    {
      index: 3,
      time: "8h30-9h",
      limit: 4
    },
    {
      index: 4,
      time: "9h-9h30",
      limit: 4
    },
    {
      index: 5,
      time: "9h30-10h",
      limit: 4
    },
    {
      index: 6,
      time: "10h-10h30",
      limit: 4
    },
    {
      index: 7,
      time: "10h30-11h",
      limit: 4
    },
    {
      index: 8,
      time: "11h-11h30",
      limit: 4
    },
    {
      index: 9,
      time: "11h30-12h",
      limit: 4
    },
    {
      index: 10,
      time: "12h-12h30",
      limit: 4
    },
    {
      index: 11,
      time: "12h30-13h",
      limit: 4
    },
    {
      index: 12,
      time: "13h-13h30",
      limit: 4
    },
    {
      index: 13,
      time: "13h30-14h",
      limit: 4
    },
    {
      index: 14,
      time: "14h-14h30",
      limit: 4
    },
    {
      index: 15,
      time: "14h30-15h",
      limit: 4
    },
    {
      index: 16,
      time: "15h30-16h",
      limit: 4
    },
    {
      index: 17,
      time: "16h-16h30",
      limit: 4
    },
    {
      index: 18,
      time: "16h30-17h",
      limit: 4
    },
    {
      index: 19,
      time: "17h-17h30",
      limit: 4
    },
    {
      index: 20,
      time: "17h30-18h",
      limit: 4
    }
  ]
  return JSON.stringify(defaultBookingConfig);
}

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('stationsId').primary();
          table.string('stationsName');
          table.string('stationUrl').defaultTo('');
          table.string('stationWebhookUrl').defaultTo('');
          table.string('stationBookingConfig', 2000).defaultTo(_getDefaultBookingConfig());
          table.string('stationCheckingConfig', 2000).defaultTo(_getDefaultCheckingConfig());
          table.boolean('stationCheckingAuto').defaultTo(false);
          table.boolean('stationUseCustomSMTP').defaultTo(false);
          table.string('stationCustomSMTPConfig', 2000).defaultTo('');
          table.boolean('stationUseCustomSMSBrand').defaultTo(false);
          table.string('stationCustomSMSBrandConfig', 2000).defaultTo('');
          table.boolean('stationEnableUseZNS').defaultTo(false);
          table.boolean('stationEnableUseSMS').defaultTo(false);
          table.boolean('stationUseCustomZNS').defaultTo(false);
          table.string('stationCustomZNSConfig', 2000).defaultTo('');
          table.string('stationsColorset').defaultTo("black");
          table.string('stationsLogo', 500).defaultTo("");
          table.string('stationsHotline', 500).defaultTo("");
          table.string('stationsEmail').defaultTo("");
          table.string('stationsAddress', 500).defaultTo("");
          table.integer('stationStatus').defaultTo(STATION_STATUS.ACTIVE);
          table.string('stationsName');
          //các field dành cho module quảng cáo
          table.boolean('stationsEnableAd').defaultTo(false); //Hiển thị quảng cáo
          table.string('stationsCustomAdBannerLeft').defaultTo(''); //Link quảng cáo trên trang thông báo (bên trái)
          table.string('stationsCustomAdBannerRight').defaultTo(''); //Link quảng cáo trên trang thông báo (bên phải)
          timestamps(table);
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          resolve()
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

async function findById(id) {
  return await Common.findById(tableName, primaryKeyField, id);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

function _makeQueryBuilderByFilter(filter, skip, limit, order) {
  let queryBuilder = DB(tableName);
  let filterData = JSON.parse(JSON.stringify(filter));


  if(filterData.stationsName){
    queryBuilder.where('stationsName', 'like', `%${filterData.stationsName}%`)
    delete filterData.stationsName;
  }
  
  queryBuilder.where(filterData);

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
    queryBuilder.orderBy("updatedAt", "desc")
  }

  return queryBuilder;
}

async function customSearch(filter, skip, limit, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, order);
  return await query.select();
}

async function customCount(filter, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, order);
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
  findById,
  count,
  updateById,
  initDB,
  modelName: tableName,
  customSearch,
  customCount,

};
