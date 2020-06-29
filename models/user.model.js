const db = require('../db.js');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

class User {
  constructor (user) {
    this.id = user.id;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.fb_uid = user.fb_uid;
    this.avatar = user.avatar;
    this.is_admin = user.is_admin;
    this.blocked = user.blocked;
    this.address_id = user.address_id;
  }

  static async create (newUser) {
    const { email, password, firstname, lastname, username, avatar, is_admin=false, blocked=false, fb_uid, address_id } = newUser; // eslint-disable-line
    const hash = await argon2.hash(password);
    return db
      .query(
        'INSERT INTO users (email, password, firstname, lastname, username, avatar, is_admin, blocked, fb_uid, address_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          email,
          hash,
          firstname,
          lastname,
          username,
          avatar,
          is_admin, // eslint-disable-line
          blocked,
          fb_uid, // eslint-disable-line
          address_id // eslint-disable-line
        ]
      )
      .then((res) => {
        newUser.id = res.insertId;
        return newUser;
      });
  }

  static async login (email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('user not found');
    } else {
      const passwordIsValid = await argon2.verify(user.password, password);
      if (!passwordIsValid) {
        throw new Error('incorrect password');
      } else {
        const data = { email: user.email, id: user.id };
        const token = jwt.sign(data, JWT_PRIVATE_KEY, { expiresIn: '24h' });
        return Promise.resolve({ token, data });
      }
    }
  }

  static async findById (id) {
    return db
      .query('SELECT * FROM users WHERE id = ?', [id])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(rows[0]);
        } else {
          const err = new Error();
          err.kind = 'not_found';
          return Promise.reject(err);
        }
      });
  }

  static async findByEmail (email) {
    return db
      .query('SELECT * FROM users WHERE email = ?', [email])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(rows[0]);
        } else {
          const err = new Error();
          err.kind = 'not_found';
          return Promise.reject(err);
        }
      });
  }

  static async usernameAlreadyExists (username) {
    return db
      .query('SELECT * FROM users WHERE username = ?', [username])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
  }

  static async emailAlreadyExists (email) {
    return db
      .query('SELECT * FROM users WHERE email = ?', [email])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
  }

  static async getAll (result) {
    return db.query('SELECT * FROM users');
  }

  static async updateById (id, user) {
    return db
      .query('UPDATE users SET firstname = ?, lastname = ?, username = ?, email = ?, avatar = ?, password = ?, fb_uid = ?, is_admin = ?, blocked = ?, address_id = ?,  WHERE id = ?', [
        user.firstname,
        user.lastname,
        user.username,
        user.email,
        user.avatar,
        user.password,
        user.fb_uid,
        user.is_admin,
        user.blocked,
        user.address_id,
        id
      ])
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM users WHERE id = ?', id).then((res) => {
      if (res.affectedRows !== 0) {
        return Promise.resolve();
      } else {
        const err = new Error();
        err.kind = 'not_found';
        return Promise.reject(err);
      }
    });
  }

  static async removeAll (result) {
    return db.query('DELETE FROM users');
  }
}

module.exports = User;
