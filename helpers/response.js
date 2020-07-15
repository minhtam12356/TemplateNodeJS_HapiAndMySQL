const Boom = require('@hapi/boom');
const Logger = require('./logging');

function setup(manager) {
  return async (request, h, method) => {
    try {
      const response = await manager[method](request);
      return response;
    } catch (e) {
      Logger.error(e);
      if (e && e.statusCode) {
        return e;
      }
      return Boom.internal(e.message, e);
    }
  };
}

module.exports = {
  setup
};
