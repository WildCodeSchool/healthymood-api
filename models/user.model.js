const db = require('../db.js');

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
    return db
      .query('INSERT INTO users SET ?', newUser)
      .then((res) => {
        newUser.id = res.insertId;
        return newUser;
      });
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
