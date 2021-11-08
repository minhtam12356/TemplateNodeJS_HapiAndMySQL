/**
 * Created by A on 7/18/17.
 */
"use strict";
const CustomerMessageResourceAccess = require("../resourceAccess/CustomerMessageResourceAccess");
const Logger = require('../../../utils/logging');
const SMSAPIFunctions = require('../../../ThirdParty/SMSAPIClient/SMSAPIClientFunctions');
const CustomerRecordResourceAccess = require("../../CustomerRecord/resourceAccess/CustomerRecordResourceAccess")
const SystemAppLogFunctions = require('../../SystemAppChangedLog/SystemAppChangedLogFunctions');
const CustomerMessageFunctions = require('../CustomerMessageFunctions');
const formatDate = require("../../../ThirdParty/FormatDate/FormatDate")
async function sendsms(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let message = req.payload.message;
      let phoneNumber = req.payload.phoneNumber;
      let result = await SMSAPIFunctions.sendSMS(message, phoneNumber);
      if (result) {
        resolve(result);
      } else {
        reject("failed");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerMessageData = req.payload;
      customerMessageData.customerStationId = req.currentUser.stationsId;
      let result = await CustomerMessageResourceAccess.insert(customerMessageData);
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
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      if(startDate){
        startDate = formatDate.FormatDate(startDate)
      }
      if(endDate){
        endDate = formatDate.FormatDate(endDate)
      }
      //only get data of current station
      if (filter && req.currentUser.stationsId) {
        filter.customerStationId = req.currentUser.stationsId;
      }
      
      let customerMessage = await CustomerMessageResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      let customerMessageCount = await CustomerMessageResourceAccess.customCount(filter, startDate, endDate, searchText, order);;
      if (customerMessage && customerMessageCount) {
        resolve({ data: customerMessage, total: customerMessageCount[0].count });
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
      let customerMessageId = req.payload.id;
      let customerMessageData = req.payload.data;
      let dataBefore = await CustomerMessageResourceAccess.findById(customerMessageId);
      let result = await CustomerMessageResourceAccess.updateById(customerMessageId, customerMessageData);

      if (result) {
        SystemAppLogFunctions.logCustomerRecordChanged(dataBefore, customerMessageData, req.currentUser);
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
      let customerMessageId = req.payload.id;
      let result = await CustomerMessageResourceAccess.findById(customerMessageId);
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

async function sendMessageByFilter(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let userStationId = req.currentUser.stationsId;
      let customerMessageContent = req.payload.customerMessageContent
      let customerMessageCategories = req.payload.customerMessageCategories;

      //retrieve info for customer list
      let customerList = await CustomerRecordResourceAccess.find(filter, undefined, undefined);

      //Send message to many customer
      let result = await CustomerMessageFunctions.sendMessageToManyCustomer(customerList, userStationId, customerMessageContent, customerMessageCategories, req.payload.customerMessageTemplateId);
      if (result) {
        resolve("success");
      } else {
        reject("failed");
      }
      
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function sendMessageByCustomerList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userStationId = req.currentUser.stationsId;
      let customerMessageContent = req.payload.customerMessageContent
      let customerMessageCategories = req.payload.customerMessageCategories;
      let customerMessageTemplateId = req.payload.customerMessageTemplateId;
      let customerList = [];
      let customerRecordIdList = req.payload.customerRecordIdList;

      //retrieve info for customer list
      for (var i = 0; i < customerRecordIdList.length; i++) {
        let customer = await CustomerRecordResourceAccess.findById(customerRecordIdList[i]);
        if (customer) {
          customerList.push(customer);
        }
      }

      //Send message to many customer
      let result = await CustomerMessageFunctions.sendMessageToManyCustomer(customerList, userStationId, customerMessageContent, customerMessageCategories, customerMessageTemplateId);
      if (result) {
        resolve("success");
      } else {
        reject("failed");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
};

async function findTemplates(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let templates = await CustomerMessageFunctions.getTemplateMessages();
      if (templates) {
        resolve(templates);
      } else {
        reject("do not have any templates");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  sendsms,
  sendMessageByFilter,
  sendMessageByCustomerList,
  findTemplates
};
