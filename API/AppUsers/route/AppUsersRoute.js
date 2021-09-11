/**
 * Created by A on 7/18/17.
 */
"use strict";
const moduleName = 'AppUsers';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const AppUsersFunctions = require('../AppUsersFunctions');
const SystemStatus = require('../../Maintain/MaintainFunctions').systemStatus;

const insertSchema = {
  lastName: Joi.string(),
  firstName: Joi.string(),
  username: Joi.string().alphanum().min(6).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phoneNumber: Joi.string().required(),
};

const updateSchema = {
  lastName: Joi.string(),
  firstName: Joi.string(),
  phoneNumber: Joi.string(),
  active: Joi.number().min(0).max(1),
  twoFACode: Joi.string(),
  userAvatar: Joi.string().allow(''),
  telegramId: Joi.string(),
  isDeleted: Joi.number(),
}

const filterSchema = {
  active: Joi.number().min(0).max(1),
  username: Joi.string().alphanum(),
  email: Joi.string().email(),
  phoneNumber: Joi.string(),
};

module.exports = {
  insert: {
    tags: ["api", `${moduleName}`],
    description: `register ${moduleName}`,
    validate: {
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
  loginUser: {
    tags: ["api", `${moduleName}`],
    description: `login ${moduleName}`,
    validate: {
      payload: Joi.object({
        username: Joi.string().alphanum().min(6).max(30).required(),
        password: Joi.string().required(),
      })
    },
    handler: function (req, res) {
      if(SystemStatus.all === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "loginUser");
    }
  },
  loginFacebook: {
    tags: ["api", `${moduleName}`],
    description: `login ${moduleName}`,
    validate: {
      payload: Joi.object({
        facebook_id: Joi.string().required(),
        facebook_avatar: Joi.string(),
        facebook_name: Joi.string(),
        facebook_email: Joi.string(),
      })
    },
    handler: function (req, res) {
      if(SystemStatus.all === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "loginFacebook");
    }
  },
  loginGoogle: {
    tags: ["api", `${moduleName}`],
    description: `login ${moduleName}`,
    validate: {
      payload: Joi.object({
        google_id: Joi.string().required(),
        google_avatar: Joi.string(),
        google_name: Joi.string(),
        google_email: Joi.string(),
      })
    },
    handler: function (req, res) {
      if(SystemStatus.all === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "loginGoogle");
    }
  },
  loginZalo: {
    tags: ["api", `${moduleName}`],
    description: `login ${moduleName}`,
    validate: {
      payload: Joi.object({
        zalo_id: Joi.string().required(),
        zalo_avatar: Joi.string(),
        zalo_name: Joi.string(),
        zalo_email: Joi.string(),
      })
    },
    handler: function (req, res) {
      if(SystemStatus.all === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "loginZalo");
    }
  },
  loginApple: {
    tags: ["api", `${moduleName}`],
    description: `login ${moduleName}`,
    validate: {
      payload: Joi.object({
        apple_id: Joi.string().required(),
        apple_avatar: Joi.string(),
        apple_name: Joi.string(),
        apple_email: Joi.string(),
      })
    },
    handler: function (req, res) {
      if(SystemStatus.all === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "loginApple");
    }
  },
  registerUser: {
    tags: ["api", `${moduleName}`],
    description: `register ${moduleName}`,
    validate: {
      payload: Joi.object({
        ...insertSchema
      })
    },
    handler: function (req, res) {
      if(SystemStatus.all === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "registerUser");
    }
  },
  resetPasswordUser: {
    tags: ["api", `${moduleName}`],
    description: `reset password ${moduleName}`,
    validate: {
      payload: Joi.object({
        username: Joi.string().required(),
      })
    },
    handler: function (req, res) {
      if(SystemStatus.all === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "resetPasswordUser");
    }
  },
  changePasswordUser: {
    tags: ["api", `${moduleName}`],
    description: `change password ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        newPassword: Joi.string().required(),
      })
    },
    handler: function (req, res) {
      Response(req, res, "changePasswordUser");
    }
  },
  verify2FA: {
    tags: ["api", `${moduleName}`],
    description: `change password ${moduleName}`,
    validate: {
      payload: Joi.object({
        otpCode: Joi.string().required(),
        id: Joi.number().required()
      })
    },
    handler: function (req, res) {
      if(SystemStatus.all === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "verify2FA");
    }
  },
  get2FACode: {
    tags: ["api", `${moduleName}`],
    description: `get QrCode for 2FA ${moduleName}`,
    handler: function (req, res) {
      if(req.query.appUserId){
        AppUsersFunctions.generate2FACode(req.query.appUserId).then((qrCode) => {
          if(qrCode){
            res.file(qrCode);
          }else{
            res("error").code(500);
          }
        });
      }else{
        res("error").code(500);
      }
    }
  },
};
