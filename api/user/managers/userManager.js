const Boom = require('@hapi/boom');
const {
  compareBcryptPassword,
  hashPassword
} = require('../../../helpers/encryption');
const { createToken } = require('../../../helpers/jwtToken');

async function getUser(req) {
  const { userService } = req.services();

  if (typeof req.params.id !== 'undefined') {
    const user = await userService.findById(req.params.id);
    return user;
  }

  const users = await userService.findAll();
  return users;
}

async function postUser(req) {
  const data = {
    email: req.payload.email,
    username: req.payload.username,
    admin: req.payload.admin || false
  };
  const { userService } = req.services();
  data.password = await hashPassword(req.payload.password);

  const userId = await userService.signUp(data);
  const user = await userService.findById(userId);

  return { ...user, id_token: createToken(user) };
}

async function verifyUniqueUser(req) {
  // Find an entry from the database that matches username

  const { userService } = req.services();
  const user = await userService.findByUsername(req.payload.username);

  if (user) {
    return Boom.badRequest('Username has been taken');
  }
  return req.payload;
}

async function verifyCredentials(req) {
  const { password } = req.payload;
  const { userService } = req.services();

  // Find an entry from the database that matches username
  const user = await userService.findByUsername(req.payload.username);

  if (user) {
    try {
      const compareResult = await compareBcryptPassword(
        password,
        user.password
      );
      if (compareResult.isValid) {
        return user;
      }
      return Boom.internal('Internal error');
    } catch (e) {
      if (e.err) {
        return Boom.internal(e.err);
      }
      return Boom.badRequest('Incorrect username/password!');
    }
  } else {
    return Boom.badRequest('Incorrect username/password!');
  }
}

module.exports = {
  getUser,
  postUser,
  verifyCredentials,
  verifyUniqueUser
};
