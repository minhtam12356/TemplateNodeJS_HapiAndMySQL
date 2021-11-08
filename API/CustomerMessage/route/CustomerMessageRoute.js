/**
 * Created by A on 7/18/17.
 */
"use strict";
const moduleName = 'CustomerMessage';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { MESSAGE_CATEGORY } = require('../CustomerMessageConstant');

const insertSchema = {
  customerMessageCategories: Joi.string(),
  customerMessageContent: Joi.string(),
  customerRecordPhone:Joi.string(),
};

const updateSchema = {
  ...insertSchema,
  isDeleted: Joi.number(),
}

const filterSchema = {
  ...insertSchema
};
const filterCustomerRecordSchema = {
  customerRecordFullName: Joi.string(),
  customerRecordPhone: Joi.string(),
  customerRecordPlatenumber: Joi.string().alphanum(),
  customerRecordState: Joi.number(),
  customerRecordEmail: Joi.string().email(),
  customerRecordPlateImageUrl: Joi.string(),
}
module.exports = {
  insert: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object(insertSchema)
    },
    handler: function (req, res) {
      Response(req, res, "insert");
    }
  },
  sendsms: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    validate: {
      payload: Joi.object({
        message: Joi.string(),
        phoneNumber: Joi.string()
      })
    },
    handler: function (req, res) {
      Response(req, res, "sendsms");
    }
  },
  updateById: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
        data: Joi.object(updateSchema),
      })
    },
    handler: function (req, res) {
      Response(req, res, "updateById");
    }
  },
  find: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        startDate: Joi.string(),
        endDate: Joi.string(),
        searchText: Joi.string(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string()
            .default("createdAt")
            .allow(""),
          value: Joi.string()
            .default("desc")
            .allow("")
        })
      })
    },
    handler: function (req, res) {
      Response(req, res, "find");
    }
  },
  findById: {
    tags: ["api", `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0)
      })
    },
    handler: function (req, res) {
      Response(req, res, "findById");
    }
  },
  searchCustomerMessage: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    validate: {
      payload: Joi.object({
        filter: Joi.object({
          customerMessageUpdateStatus: Joi.number(),
          customerMessageCategories: Joi.string(),
          customerMessageName: Joi.string(),
        }),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default("updatedAt"),
          value: Joi.string().default("desc")
        })
      })
    },
    handler: function (req, res) {
      Response(req, res, "searchCustomerMessage");
    }
  },
  summaryView: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    validate: {
      payload: Joi.object({
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
      })
    },
    handler: function (req, res) {
      Response(req, res, "summaryView");
    }
  },
  sendMessageByFilter: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        customerMessageContent:Joi.string(),
        customerMessageCategories:Joi.string().default(MESSAGE_CATEGORY.EMAIL).allow([MESSAGE_CATEGORY.EMAIL, MESSAGE_CATEGORY.SMS]),
        customerMessageTemplateId: Joi.number().min(0),
        filter: Joi.object(filterCustomerRecordSchema),
      })
    },
    handler: function (req, res) {
      Response(req, res, "sendMessageByFilter");
    }
  },
  sendMessageByCustomerList: {
    tags: ["api", `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        customerMessageContent:Joi.string(),
        customerMessageCategories:Joi.string().default(MESSAGE_CATEGORY.EMAIL).allow([MESSAGE_CATEGORY.EMAIL, MESSAGE_CATEGORY.SMS]),
        customerRecordIdList: Joi.array().items(Joi.number()),
        customerMessageTemplateId: Joi.number().min(0)
      })
    },
    handler: function (req, res) {
      Response(req, res, "sendMessageByCustomerList");
    }
  },
  findTemplates: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
      })
    },
    handler: function (req, res) {
      Response(req, res, "findTemplates");
    }
  },
};
