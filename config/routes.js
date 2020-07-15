const user = require('../api/user/routes/userRoute');

const basePath = '/api/v1';

module.exports = [
  { method: 'POST', path: basePath.concat('/users'), config: user.postUser },
  { method: 'GET', path: basePath.concat('/users'), config: user.getUser },
  {
    method: 'POST',
    path: basePath.concat('/authenticate'),
    config: user.postAuthenticate
  }
];
