/**
 * Created by Huu on 12/06/21.
 */
"use strict";
const moduleName = "UserPaymentServicePackage";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../Common/CommonFunctions");
const { PACKAGE_STATUS } = require('../PaymentServicePackageConstant');

const insertSchema = {
  packageName: Joi.string().required(),
  packagePrice: Joi.number().required(),
  packageDiscountPrice: Joi.number(),
  packagePerformance: Joi.number().required().min(1),
  packageUnitId: Joi.number().required().min(0),
  packageDuration: Joi.number().required().min(1),
  packageStatus: Joi.number().allow([PACKAGE_STATUS.NORMAL, PACKAGE_STATUS.HOT, PACKAGE_STATUS.NEW])
};

const filterSchema = {
  packageUnitId: Joi.number(),
}

module.exports = {
  buyServicePackage: {
    tags: ["api", `${moduleName}`],
    description: `buyServicePackage ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
    ],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentServicePackageId: Joi.number().required().min(1),
        secondaryPassword: Joi.string().min(6),
      }),
    },
    handler: function (req, res) {
      Response(req, res, "buyServicePackage");
    },
  },
  historyServicePackage: {
    tags: ["api", `${moduleName}`],
    description: `user view historyServicePackage ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
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
        startDate: Joi.string(),
        endDate: Joi.string(),
        order: Joi.object({
          key: Joi.string().default("createdAt").allow(""),
          value: Joi.string().default("desc").allow(""),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, "historyServicePackage");
    },
  },
  getUserServicePackage: {
    tags: ["api", `${moduleName}`],
    description: `user getUserServicePackage ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
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
        startDate: Joi.string(),
        endDate: Joi.string(),
        order: Joi.object({
          key: Joi.string().default("createdAt").allow(""),
          value: Joi.string().default("desc").allow(""),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, "getUserServicePackage");
    },
  },
  userGetBalanceByUnitId: {
    tags: ["api", `${moduleName}`],
    description: `user view balance by unitId ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
    ],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object({
          walletBalanceUnitId: Joi.number().required().min(2)
        }),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default("createdAt").allow(""),
          value: Joi.string().default("desc").allow(""),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, "userGetBalanceByUnitId");
    },
  },
  userActivateServicePackage: {
    tags: ["api", `${moduleName}`],
    description: `userActivateServicePackage ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
    ],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentServicePackageUserId: Joi.number().required().min(1)
      }),
    },
    handler: function (req, res) {
      Response(req, res, "userActivateServicePackage");
    },
  },
  userCollectServicePackage: {
    tags: ["api", `${moduleName}`],
    description: `userCollectServicePackage ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
    ],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        paymentServicePackageUserId: Joi.number().required().min(1)
      }),
    },
    handler: function (req, res) {
      Response(req, res, "userCollectServicePackage");
    },
  },
  getListUserBuyPackage: {
    tags: ["api", `${moduleName}`],
    description: `getListUserBuyPackage ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
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
        startDate: Joi.string(),
        endDate: Joi.string(),
        order: Joi.object({
          key: Joi.string().default("createdAt").allow(""),
          value: Joi.string().default("desc").allow(""),
        }),
      }),
    },
    handler: function (req, res) {
      Response(req, res, "getListUserBuyPackage");
    },
  },
};
