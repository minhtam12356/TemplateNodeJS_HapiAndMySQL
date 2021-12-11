/**
 * Created by A on 7/18/17.
 */
"use strict";
const CustomerScheduleResourceAccess = require("../resourceAccess/CustomerScheduleResourceAccess");
const StationResource = require('../../Stations/resourceAccess/StationsResourceAccess');
const ScheduleFunctions = require('../CustomerScheduleFunctions');
const EmailFunctions = require('../../Email/EmailFunctions');
const SMSClientFunctions = require("../../../ThirdParty/SMSAPIClient/SMSAPIClientFunctions");
const { MESSAGE_CATEGORY } = require('../../CustomerMessage/CustomerMessageConstant');

const Logger = require('../../../utils/logging');
async function _confirmScheduleBySMS(phone, scheduleData, stationData) {
  let message = `Xin chào ${scheduleData.fullnameSchedule} 
  ${stationData.stationsName} xác nhận lịch hẹn kiểm định của khách hàng có ô tô BKS ${scheduleData.licensePlates}
  vào lúc ${scheduleData.time} ${scheduleData.dateSchedule} tại ${stationData.stationsAddress}. 
  *** LƯU Ý: Mọi thông tin cần hỗ trợ qua số hotline ${stationData.stationsHotline}. Trân thành cảm ơn quý khách`;
  let smsResult = await SMSClientFunctions.sendSMS(message, phone);
  if (smsResult === undefined) {
    console.error(`can not send sms to ${phone} for new schedule`)
  }
}
async function _addNewCustomerSchedule(scheduleData, stationsData) {
  let result = await ScheduleFunctions.insertSchedule(scheduleData);
  if (result) {
    //only send email if customer want to receive email
    if (scheduleData.notificationMethod && scheduleData.notificationMethod === MESSAGE_CATEGORY.EMAIL && scheduleData.email && scheduleData.email !== "") {
      //if there is no station data
      if (stationsData === undefined) {
        stationsData = StationResource.find({ stationsId: scheduleData.stationsId });
        if (stationsData && stationsData.length > 0) {
          stationsData = stationsData[0];
        } else {
          console.error(`can not find station of new schedule`);
        }
      }

      //if station data is valid, then send email
      if (stationsData) {
        EmailFunctions.confirmScheduleViaEmail(scheduleData.email, scheduleData, stationsData).then((emailResult) => {
          if (emailResult === undefined) {
            console.error(`can not send email to ${scheduleData.email} of new schedule`);
          }
        });
      }
    }      
    //only send sms if customer want to receive sms
    else if (scheduleData.notificationMethod && scheduleData.notificationMethod === MESSAGE_CATEGORY.SMS && scheduleData.phone && scheduleData.phone !== "") {
      //if there is no station data
      if (stationsData === undefined) {
        stationsData = StationResource.find({ stationsId: scheduleData.stationsId });
        if (stationsData && stationsData.length > 0) {
          stationsData = stationsData[0];
        } else {
          console.error(`can not find station of new schedule`);
        }
      }

      //if station data is valid, then send email
      if (stationsData) {
        _confirmScheduleBySMS(scheduleData.phone, scheduleData, stationsData);
      }
    }
  } else {
    console.error(`can not add new schedule`);
  }
  return result;
}

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerScheduleData = req.payload;
      let result = await _addNewCustomerSchedule(customerScheduleData);
      if (result) {
        resolve(result);
      }
      reject("failed");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = req.payload.searchText;
      let endDate = req.payload.endDate;
      let startDate = req.payload.startDate;

      //only get data of current station
      if (filter && req.currentUser.stationsId) {
        filter.stationsId = req.currentUser.stationsId;
      }
      let customerScheduleList = await CustomerScheduleResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      let customerScheduleCount = await CustomerScheduleResourceAccess.customCount(filter, startDate, endDate, searchText, order);

      if (customerScheduleList && customerScheduleCount) {
        resolve({ data: customerScheduleList, total: customerScheduleCount });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerScheduleId = req.payload.customerScheduleId;
      let customerScheduleData = req.payload.data;
      let result = await CustomerScheduleResourceAccess.updateById(customerScheduleId, customerScheduleData);
      if (result) {
        resolve(result);
      }
      reject("failed");
    } catch (e) {

      Logger.error(__filename, e);
      reject("failed");
    }
  });
};


async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerScheduleId = req.payload.customerScheduleId;
      let result = await CustomerScheduleResourceAccess.findById(customerScheduleId);
      if (result) {
        resolve(result);
      }
      reject("failed");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerScheduleId = req.payload.customerScheduleId;

      let result = await CustomerScheduleResourceAccess.deleteById(customerScheduleId);
      if (result) {
        resolve(result);
      }
      else {
        reject("failed");
      }

    } catch (e) {

      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function userInsertSchedule(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerScheduleData = req.payload;
      let selectedStation = await StationResource.find({ stationUrl: req.payload.stationUrl });
      if (selectedStation && selectedStation.length > 0) {
        selectedStation = selectedStation[0];
        
        delete customerScheduleData.stationUrl;
        customerScheduleData.stationsId = selectedStation.stationsId;

        let result = await _addNewCustomerSchedule(customerScheduleData, selectedStation);
        if (result) {
          resolve(result);
          return;
        }
      } else {
        console.error(`can not find station for userInsertSchedule`)
      }

      reject("failed");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

module.exports = {
  insert,
  find,
  updateById,
  findById,
  deleteById,
  userInsertSchedule
};
