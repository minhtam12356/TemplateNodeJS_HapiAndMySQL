/**
 * Created by A on 7/18/17.
 */
'use strict';
const Handlebars = require("handlebars");

const CustomerMessageResourceAccess = require('./resourceAccess/CustomerMessageResourceAccess');
const MessageCustomerResourceAccess = require('./resourceAccess/MessageCustomerResourceAccess');
const StationsResource = require('../Stations/resourceAccess/StationsResourceAccess');
const CustomerRecord = require('../CustomerRecord/resourceAccess/CustomerRecordResourceAccess');
const CustomerSchedule = require('../CustomerSchedule/resourceAccess/CustomerScheduleResourceAccess');
const ApiUtilsFunctions = require('../ApiUtils/utilFunctions');

const FUNC_SUCCESS = 1;
const FUNC_FAILED = undefined;

const messageTemplate = [
  {
    messageTemplateId: 1,
    messageTemplateContent: "Mời bạn đăng ký đăng kiểm tại {{stationsAddress}} cho ô tô BKS số {{customerRecordPlatenumber}}",
    messageTemplateName: "CSKH",
    messageTemplateScope: [CustomerRecord.modelName]
  },
  {
    messageTemplateId: 2,
    messageTemplateName: "Nhắc đăng kiểm",
    messageTemplateContent: "Ô tô BKS số {{customerRecordPlatenumber}} hết hạn đăng kiểm vào {{customerRecordCheckExpiredDate}}. Mời bạn đăng ký đăng kiểm tại {{stationsAddress}}",
    messageTemplateScope: [CustomerRecord.modelName]
  },
];

function _importDataForMessage(customer) {
  return {
    customerMessageEmail: customer.customerRecordEmail,
    customerMessagePlateNumber: customer.customerRecordPhone,
    customerMessagePhone: customer.customerRecordPlatenumber,
    customerId: customer.customerRecordId,
  }
}

async function checkValidTemplateMessage(messageTemplateId) {
  //check if using template and template is valid
  let templateData = undefined;
  if (messageTemplateId) {
    for (let i = 0; i < messageTemplate.length; i++) {
      const template = messageTemplate[i];
      if (messageTemplateId * 1 === template.messageTemplateId * 1 ) {
        templateData = template;
        break;
      }
    }

    if (templateData === undefined) {
      console.error(`there is no template with id ${messageTemplateId}`)
      return FUNC_FAILED;
    }
  }
  return templateData;
}

async function getMessageContentByTemplate(messageTemplateId, station, customer) {
  //check if station / customer data is valid
  if (station === undefined || customer === undefined) {
    return FUNC_FAILED;
  }

  //check if using template and template is valid
  let templateData = await checkValidTemplateMessage(messageTemplateId);
  if (templateData === undefined) {
    console.error(`there is no template with id ${messageTemplateId}`)
    return FUNC_FAILED;
  }

  //generate content by template & customer data
  let templateParams = {
    ...customer,
    ...station
  };

  //if this message is "REMIND SCHEDULE" message
  //else default is "CUSTOMER SERVICE" message
  if (templateData.messageTemplateScope.indexOf(CustomerSchedule.modelName) > -1) {
    let scheduleData = CustomerSchedule.find({
      licensePlates: customer.customerRecordPlatenumber
    });
    if (scheduleData && scheduleData.length > 0) {
      scheduleData = scheduleData[0];
      templateParams = {
        ...templateParams,
        ...scheduleData,
      }
    }
  }

  let customerMessageContent = Handlebars.compile(templateData.messageTemplateContent)(templateParams);
  return customerMessageContent;
}

async function _createNewMessage(stationsId, customerMessageContent, customerMessageCategories, customerMessageTemplateId) {
  let _enableUsingTemplate = false;

  let templateContent = await checkValidTemplateMessage(customerMessageTemplateId);
  if (templateContent) {
    _enableUsingTemplate = true;
  }

  //get station info
  let station = await StationsResource.findById(stationsId);
  if (station === undefined) {
    return FUNC_FAILED;
  }

  //create data for message
  let dataMessage = {
    "customerMessageCategories": customerMessageCategories,
    "customerMessageContent": customerMessageContent,
    "customerStationId": stationsId,
    "customerMessageTitle": `Thông báo hệ thống từ ${station.stationsName}`
  };

  if (_enableUsingTemplate) {
    dataMessage.customerMessageContent = templateContent.messageTemplateContent;
    dataMessage.customerMessageTemplateId = customerMessageTemplateId;
  }

  let messageId = await CustomerMessageResourceAccess.insert(dataMessage);
  if (messageId) {
    messageId = messageId[0];
    return messageId;
  } else {
    return undefined;
  }
}

//Send message to many customer
async function sendMessageToManyCustomer(customerList, stationsId, customerMessageContent, customerMessageCategories, customerMessageTemplateId) {
  if (customerList.length <= 0) {
    return FUNC_SUCCESS;
  }

  let messageId = await _createNewMessage(stationsId, customerMessageContent, customerMessageCategories, customerMessageTemplateId);
  if (messageId === undefined) {
    console.error(`can not create new message`);
    return FUNC_FAILED;
  }

  let messageList = [];
  for (var i = 0; i < customerList.length; i++) {
    const customer = customerList[i];
    let customerMessage = {
      ..._importDataForMessage(customer),
      messageId: messageId,
      customerStationId: stationsId
    }
    messageList.push(customerMessage);
  }

  //Chunk array into multiple batches of 100
  if (messageList.length > 100) {
    let batches = await ApiUtilsFunctions.chunkArray(messageList, 100);
    for (var i = 0; i < batches.length; i++) {
      await MessageCustomerResourceAccess.insert(batches[i]);
    }
  } else {
    await MessageCustomerResourceAccess.insert(messageList);
  }
  return FUNC_SUCCESS;
}

async function getTemplateMessages() {
  return messageTemplate;
}

module.exports = {
  getTemplateMessages,
  sendMessageToManyCustomer,
  getMessageContentByTemplate
}