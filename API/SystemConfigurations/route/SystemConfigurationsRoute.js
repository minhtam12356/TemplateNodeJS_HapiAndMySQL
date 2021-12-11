/**
 * Created by A on 7/18/17.
 */
"use strict";
const moduleName = 'SystemConfigurations';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const updateSchema = {
  systemLeftBannerAd: Joi.string().allow(''),
  systemRightBannerAd: Joi.string().allow('')
}

module.exports = {
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
        //only support for 1 system configuration, then no need to specify id
        data: Joi.object(updateSchema),
      })
    },
    handler: function (req, res) {
      Response(req, res, "updateById");
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
        id: Joi.number().min(1).max(1).default(1) //only support for 1 system configuration
      })
    },
    handler: function (req, res) {
      Response(req, res, "findById");
    }
  },
};
