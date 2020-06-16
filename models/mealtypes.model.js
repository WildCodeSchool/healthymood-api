const db = require('../db.js');

class mealtypes {
  constructor (mealtypes) {
    this.id = mealtypes.id;
    this.name = mealtypes.name;
  }

  static async create (newmealtypes) {
    return db
      .query('INSERT INTO mealtypes SET ?', newmealtypes)
      .then((res) => {
        newmealtypes.id = res.insertId;
        return newmealtypes;
      });
  }

  static async findById (id) {
    return db
      .query('SELECT * FROM mealtypes WHERE id = ?', [id])
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

  static async nameAlreadyExists (name) {
    return db
      .query('SELECT * FROM mealtypes WHERE name = ?', [name])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
  }

  static async getAll (result) {
    return db.query('SELECT * FROM mealtypes');
  }

  static async updateById (id, mealtypes) {
    return db
      .query('UPDATE mealtypes SET name = ? WHERE id = ?', [
        mealtypes.name,
        id
      ])
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM mealtypes WHERE id = ?', id).then((res) => {
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
    return db.query('DELETE FROM mealtypes');
  }
}

module.exports = mealtypes;
