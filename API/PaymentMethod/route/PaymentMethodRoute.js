"use strict";
const moduleName = 'PaymentMethod';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const insertSchema = {
  paymentMethodName: Joi.string(),
};

const updateSchema = {
  ...insertSchema,
}

const deleteSchema = {
  ...insertSchema,
}

module.exports = {
  insert: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
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
  find: {
    tags: ["api", `${moduleName}`],
    description: `select ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
    },
    handler: function (req, res) {
      Response(req, res, "find");
    }
  },
  updateById: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
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
  deleteById: {
    tags: ["api", `${moduleName}`],
    description: `delete ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
        data: Joi.object(deleteSchema),
      })
    },
    handler: function (req, res) {
      Response(req, res, "deleteById");
    }
  }
}