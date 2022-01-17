/**
 * Created by Huu on 12/06/21.
 */
"use strict";
const moduleName = "PaymentServiceBonusPackage";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../Common/CommonFunctions");
const { PACKAGE_STATUS , PACKAGE_CATEGORY} = require('../PaymentServicePackageConstant');

const insertSchema = {
  packageName: Joi.string().required(),
  packageDescription: Joi.string(),
  packagePerformance: Joi.number().required().min(1),
  packageUnitId: Joi.number().required().min(0),
  packageDuration: Joi.number().required().min(1),
  packageCategory: Joi.string().default(PACKAGE_CATEGORY.BONUS),
  packageStatus: Joi.number().allow([PACKAGE_STATUS.NORMAL, PACKAGE_STATUS.HOT, PACKAGE_STATUS.NEW]).default(PACKAGE_STATUS.NORMAL),
  referralPackageCountRequired: Joi.number().required().min(1),
  referralUserCountRequired: Joi.number().required().min(1),
};

const filterSchema = {
  packageUnitId: Joi.number(),
  packageStatus: Joi.number(),
  packageCategory: Joi.string().default(PACKAGE_CATEGORY.BONUS),
}

const updateSchema = {
  packageName: Joi.string(),
  packageDescription: Joi.string(),
  packagePerformance: Joi.number().min(1),
  packageUnitId: Joi.number().min(0),
  packageDuration: Joi.number().min(1),
  packageStatus: Joi.number().allow([PACKAGE_STATUS.NORMAL, PACKAGE_STATUS.HOT, PACKAGE_STATUS.NEW]),
  referralPackageCountRequired: Joi.number().min(1),
  referralUserCountRequired: Joi.number().min(1),
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
  userGetListPaymentBonusPackage: {
    tags: ["api", `${moduleName}`],
    description: `user get list ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyTokenOrAllowEmpty }
    ],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
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
      Response(req, res, "userGetListPaymentBonusPackage");
    },
  },
  userClaimBonusPackage: {
    tags: ["api", `${moduleName}`],
    description: `user get list ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyTokenOrAllowEmpty }
    ],
    validate: {
      headers: Joi.object({
        authorization: Joi.string().allow(''),
      }).unknown(),
      payload: Joi.object({
        userBonusPackageId: Joi.number().default(0).min(0),
        secondaryPassword: Joi.string().min(6),
      }),
    },
    handler: function (req, res) {
      Response(req, res, "userClaimBonusPackage");
    },
  },
};
