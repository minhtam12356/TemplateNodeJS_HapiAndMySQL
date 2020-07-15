// const Util = require('util');
const Boom = require('@hapi/boom');
const Bounce = require('@hapi/bounce');
const { UniqueViolationError } = require('objection');
// const SecurePassword = require('secure-password');
const Schmervice = require('schmervice');

class UserService extends Schmervice.Service {
  constructor(...args) {
    super(...args);

    // const pwd = new SecurePassword();

    this.pwd = {
      hash: () => {}, // Util.promisify(pwd.hash.bind(pwd)),
      verify: () => {} // Util.promisify(pwd.verify.bind(pwd))
    };
  }

  async findById(id, txn) {
    const { User } = this.server.models();

    const user = await User.query(txn)
      .throwIfNotFound()
      .findById(id)
      .select(['id', 'username', 'email', 'admin']);
    return user;
  }

  async findAll(txn) {
    const { User } = this.server.models();

    const users = await User.query(txn)
      .throwIfNotFound()
      .select(['id', 'username', 'email', 'admin']);
    return users;
  }

  async findByUsername(username, txn) {
    const { User } = this.server.models();

    const user = await User.query(txn)
      .first()
      .where({ username });
    return user;
  }

  async follow(currentUserId, id, txn) {
    const { User } = this.server.models();

    if (currentUserId === id) {
      throw Boom.forbidden();
    }

    try {
      await User.relatedQuery('following', txn)
        .for(currentUserId)
        .relate(id);
    } catch (err) {
      Bounce.ignore(err, UniqueViolationError);
    }
  }

  async unfollow(currentUserId, id, txn) {
    const { User } = this.server.models();

    if (currentUserId === id) {
      throw Boom.forbidden();
    }

    await User.relatedQuery('following', txn)
      .for(currentUserId)
      .unrelate()
      .where({ id });
  }

  async signUp(userInfo, txn) {
    const { User } = this.server.models();

    const { id } = await User.query(txn).insert(userInfo);

    return id;
  }

  async update(id, { password, ...userInfo }, txn) {
    const { User } = this.server.models();

    if (Object.keys(userInfo).length > 0) {
      await User.query(txn)
        .throwIfNotFound()
        .where({ id })
        .patch(userInfo);
    }

    if (password) {
      await this.changePassword(id, password, txn);
    }

    return id;
  }

  async changePassword(id, password, txn) {
    const { User } = this.server.models();

    await User.query(txn)
      .throwIfNotFound()
      .where({ id })
      .patch({
        password: await this.pwd.hash(Buffer.from(password))
      });

    return id;
  }
}

module.exports = UserService;
