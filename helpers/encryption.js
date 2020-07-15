const bcrypt = require('bcrypt');
const AppConfig = require('../config/app');

function compareBcryptPassword(password1, password2) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password1, password2, (err, isValid) => {
      if (err) {
        reject(new Error(err));
      }
      if (isValid) {
        resolve({ isValid: true });
      } else {
        reject(new Error('password is not valid'));
      }
    });
  });
}

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    // Generate a salt at level 10 strength
    bcrypt.genSalt(AppConfig.bScrypt.saltRound, (err, salt) => {
      if (!err) {
        bcrypt.hash(password, salt, (error, hash) => {
          if (error) {
            reject(error);
          } else {
            resolve(hash);
          }
        });
      } else {
        reject(err);
      }
    });
  });
}

module.exports = {
  compareBcryptPassword,
  hashPassword
};
