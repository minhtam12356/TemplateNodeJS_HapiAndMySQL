const Schwifty = require('schwifty');
const Joi = require('@hapi/joi');

module.exports = class User extends Schwifty.Model {
  static get tableName() {
    return 'users';
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number()
        .integer()
        .greater(0),
      username: Joi.string()
        .min(6)
        .max(30)
        .required(),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
      password: Joi.string()
        .min(6)
        .required(),
      admin: Joi.boolean()
    }); // eslint-disable-line no-undef
  }
};
