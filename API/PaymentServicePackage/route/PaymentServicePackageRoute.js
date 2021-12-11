/**
 * Created by Huu on 12/06/21.
 */
"use strict";
const moduleName = "PaymentServicePackage";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../Common/CommonFunctions");

const insertSchema = {
  paymentPackageName: Joi.string().required(),
  rechargePackage: Joi.number().required(),
  promotion: Joi.number().required(),
  status: Joi.number()
};
const filterSchema = {
  paymentPackageName: Joi.string(),
  rechargePackage: Joi.number(),
  promotion: Joi.number(),
  status: Joi.number()
}
const updateSchema = {
  paymentPackageName: Joi.string().required(),
  rechargePackage: Joi.number().required(),
  promotion: Joi.number().required(),
  status: Joi.number()
};

module.exports = {
  insert: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyStaffToken },
    ],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object(insertSchema),
    },
    handler: function (req, res) {
      Response(req, res, "insert");
    },
  },
  updateById: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyStaffToken },
    ],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
        data: Joi.object(updateSchema),
      }),
    },
    handler: function (req, res) {
      Response(req, res, "updateById");
    },
  },
  find: {
    tags: ["api", `${moduleName}`],
    description: `get list ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyStaffToken },
    ],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default("createdAt").allow(""),
          value: Joi.string().default("desc").allow(""),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, "find");
    },
  },
  deleteById: {
    tags: ["api", `${moduleName}`],
    description: `delete ${moduleName} by id`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyStaffToken },
    ],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0).required(),
      }),
    },
    handler: function (req, res) {
      Response(req, res, "deleteById");
    },
  },
  findById: {
    tags: ["api", `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken },],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, "findById");
    },
  },
  userGetListPaymentPackage: {
    tags: ["api", `${moduleName}`],
    description: `user get list ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken }
    ],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default("createdAt").allow(""),
          value: Joi.string().default("desc").allow(""),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, "find");
    },
  },

  userGetPaymentPackageById: {
    tags: ["api", `${moduleName}`],
    description: `user find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: function (req, res) {
      Response(req, res, "findById");
    },
  },
};
