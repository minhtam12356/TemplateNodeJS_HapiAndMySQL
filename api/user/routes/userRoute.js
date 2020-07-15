const Joi = require('@hapi/joi');
const userManager = require('../managers/userManager');
const UserModel = require('../models/userModel');
const responseHandler = require('../../../helpers/response').setup(userManager);
const { failValidateAction } = require('../../../helpers/validation');
const { createToken } = require('../../../helpers/jwtToken');

module.exports = {
  getUser: {
    tags: ['api', 'User'],
    description: 'get users',
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
        language: Joi.string()
      }).unknown(),
      failAction: failValidateAction
    },
    handler: async (req, h) => {
      const response = await responseHandler(req, h, 'getUser');
      return response;
    }
    // Add authentication to this route
    // The user must have a scope of `admin`
    /*    auth: {
      strategy: 'jwt'
      // scope: ['admin']
    } */
  },
  postUser: {
    tags: ['api', 'User'],
    description: 'create users',
    pre: [{ method: userManager.verifyUniqueUser }],
    validate: {
      payload: Joi.object({
        username: UserModel.field('username'),
        email: UserModel.field('email'),
        password: UserModel.field('password')
      }).label('UserInfo'),
      failAction: failValidateAction
    },
    handler: async (req, h) => {
      const response = await responseHandler(req, h, 'postUser');
      return response;
    }
  },
  postAuthenticate: {
    tags: ['api', 'User'],
    description: 'Authenticate',
    pre: [{ method: userManager.verifyCredentials, assign: 'user' }],
    // eslint-disable-next-line no-unused-vars
    handler: async (req, h) => {
      // If the user's password is correct, we can issue a token.
      // If it was incorrect, the error will bubble up from the pre method
      return { ...req.pre.user, id_token: await createToken(req.pre.user) };
    },
    validate: {
      payload: Joi.alternatives().try(
        Joi.object({
          username: UserModel.field('username'),
          password: UserModel.field('password')
        }).label('LoginInfo'),
        Joi.object({
          email: UserModel.field('email'),
          password: UserModel.field('password')
        }).label('LoginInfo')
      ),
      failAction: failValidateAction
    }
  }
};
