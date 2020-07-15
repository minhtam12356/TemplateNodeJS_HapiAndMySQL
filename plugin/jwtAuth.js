// Plugin for JWT based authentication.

// eslint-disable-next-line no-unused-vars
const validateFunc = (decoded, request, h) => {
  // do your checks to see if the person is valid if necessary
  if (!decoded.id) {
    return { isValid: false };
  }
  return { isValid: true };
};

module.exports.plugin = {
  register: (server, options) => {
    server.auth.strategy('jwt', 'jwt', {
      key: options.key,
      validate: validateFunc, // validate function defined above
      verifyOptions: {
        algorithms: options.algorithm
      }
      // Uncomment this to apply default auth to all routes
      // plugin.auth.default('jwt');
    });
  },
  name: 'jwt-auth'
};
