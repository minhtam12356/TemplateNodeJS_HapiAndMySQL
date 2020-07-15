//  API response formatter plugin
const Error = require('../config/error');
const pkg = require('../package.json');

module.exports.plugin = {
  register: server => {
    server.ext('onPreResponse', (request, h) => {
      const { response } = request;
      const lg = request.headers.language || 'en';

      if (response.isBoom && response.output && response.output.payload) {
        const error = new Error(lg).getError(
          response.output.payload.statusCode || response.output.statusCode
        );
        response.output.payload.success = error.success;
        if (!response.output.payload.message)
          response.output.payload.message = error.message;
      }

      return h.continue;
    });
  },
  pkg,
  name: 'api-response-formatter'
};
