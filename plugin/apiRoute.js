// Plugin for API Routes

const Schwifty = require('schwifty');
const Glob = require('glob');
const Schmervice = require('schmervice');
const Routes = require('../config/routes');

module.exports.plugin = {
  register: async server => {
    // load all models and register to schwifty
    await server.register(Schwifty);

    const models = Glob.sync('api/**/models/*.js');
    models.forEach(model => {
      const modelClass = require('../'.concat(model)); // eslint-disable-line global-require
      server.schwifty(modelClass);
    });

    // load all services and register to hapi
    await server.register(Schmervice);

    const services = Glob.sync('api/**/services/*.js');
    services.forEach(service => {
      const serviceClass = require('../'.concat(service)); // eslint-disable-line global-require
      server.registerService(serviceClass);
    });

    server.route(Routes);
  },
  name: 'api-route'
};
