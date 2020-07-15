const Glue = require('@hapi/glue');
const Logger = require('./helpers/logging');
const Manifest = require('./config/manifest');

module.exports.deployment = async start => {
  const manifest = Manifest.get('/');
  const server = await Glue.compose(manifest, { relativeTo: __dirname });

  await server.initialize();

  if (!start) {
    return server;
  }

  await server.start();

  Logger.info(`Server started at ${server.info.uri}`);

  return server;
};

if (!module.parent) {
  module.exports.deployment(true);

  process.on('unhandledRejection', err => {
    throw err;
  });
}
