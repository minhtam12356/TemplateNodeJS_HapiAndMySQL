const jwt = require('jsonwebtoken');
const AppConfig = require('../config/app');

async function createToken(user) {
  let scopes;
  // Check if the user object passed in has admin set to true,
  // and if so, set scopes to admin
  if (user.admin) {
    scopes = 'admin';
  }
  // Sign the JWT
  const token = await jwt.sign(
    {
      id: user.id,
      username: user.username,
      scope: scopes
    },
    AppConfig.jwt.secret,
    {
      algorithm: 'HS256',
      expiresIn: AppConfig.jwt.expiresIn
    }
  );
  return token;
}

module.exports = {
  createToken
};
