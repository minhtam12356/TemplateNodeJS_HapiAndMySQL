/**
 * Created by A on 7/18/17.
 */
 "use strict";
 const moduleName = 'DataFilter';
 const Manager = require(`../manager/${moduleName}Manager`);
 const Joi = require("joi");
 const Response = require("../../Common/route/response").setup(Manager);
 const CommonFunctions = require('../../Common/CommonFunctions');
 
const filterAreaDataSchema = {
  AreaDataName: Joi.string(),
  AreaParentId: Joi.number().default(1).required()
};

const filterRealEstateSchema = {
  realEstatePostTypeId: Joi.number().default(1).required()
};

 module.exports = {
   getAreaData: {
     tags: ["api", `${moduleName}`],
     description: `user get area data - ${moduleName}`,
     validate: {
       payload: Joi.object({
         ...filterAreaDataSchema,
       })
     },
     handler: function (req, res) {
       Response(req, res, "getAreaData");
     }
   },
  getDataFilterRealEstate: {
    tags: ["api", `${moduleName}`],
    description: `user get direction, category, type data - ${moduleName}`,
    validate: {
      payload: Joi.object({
        ...filterRealEstateSchema,
      })
    },
    handler: function (req, res) {
      Response(req, res, "getDataFilterRealEstate");
    }  
  }
 };
 