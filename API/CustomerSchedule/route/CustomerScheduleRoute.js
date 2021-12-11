/**
 * Created by A on 7/18/17.
 */
"use strict";
const moduleName = 'CustomerSchedule';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { MESSAGE_CATEGORY } = require('../../CustomerMessage/CustomerMessageConstant');

const insertSchema = {
  licensePlates: Joi.string().required(),
  phone: Joi.string(),
  fullnameSchedule: Joi.string(),
  email: Joi.string(),
  dateSchedule: Joi.string(),
  time: Joi.string(),
  stationsId: Joi.number(),
  notificationMethod: Joi.string().required().valid([MESSAGE_CATEGORY.SMS,MESSAGE_CATEGORY.EMAIL])
};

const updateSchema = {
  licensePlates: Joi.string(),
  phone: Joi.string(),
  fullnameSchedule: Joi.string(),
  email: Joi.string(),
  dateSchedule: Joi.string(),
  time: Joi.string(),
  stationsId: Joi.number(),
  isDeleted: Joi.number(),
  notificationMethod: Joi.string().valid([MESSAGE_CATEGORY.SMS,MESSAGE_CATEGORY.EMAIL]),
  CustomerScheduleStatus:Joi.number()
}

const filterSchema = {
  licensePlates: Joi.string(),
  phone: Joi.string(),
  fullnameSchedule: Joi.string(),
  email: Joi.string(),
  dateSchedule: Joi.string(),
  time: Joi.string(),
  stationsId: Joi.number(),
  isDeleted: Joi.number(),
  notificationMethod: Joi.string().valid([MESSAGE_CATEGORY.SMS,MESSAGE_CATEGORY.EMAIL]),
  CustomerScheduleStatus:Joi.number()

};

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
        customerScheduleId: Joi.number().min(0),
        data: Joi.object(updateSchema),
      })
    },
    handler: function (req, res) {
      Response(req, res, "updateById");
    }
  },
  find: {
    tags: ["api", `${moduleName}`],
    description: `List ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        searchText:Joi.string(),
        filter: Joi.object(filterSchema),
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
        customerScheduleId: Joi.number().min(0)
      })
    },
    handler: function (req, res) {
      Response(req, res, "findById");
    }
  },
  userInsertSchedule: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    validate: {
      payload: Joi.object({
        ...insertSchema,
        stationUrl: Joi.string().required()
      })
    },
    handler: function (req, res) {
      Response(req, res, "userInsertSchedule");
    }
  },
  deleteById: {
    tags: ["api", `${moduleName}`],
    description: `Delete ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        customerScheduleId: Joi.number().min(0),
        
      })
    },
    handler: function (req, res) {
      Response(req, res, "deleteById");
    }
  },
};
