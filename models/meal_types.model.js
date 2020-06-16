const db = require('../db.js');

class meal_types {
  constructor (meal_types) {
    this.id = meal_types.id;
    this.name = meal_types.name;
  }

  static async create (newmeal_types) {
    return db
      .query('INSERT INTO meal_types SET ?', newmeal_types)
      .then((res) => {
        newmeal_types.id = res.insertId;
        return newmeal_types;
      });
  }

  static async findById (id) {
    return db
      .query('SELECT * FROM meal_types WHERE id = ?', [id])
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
      .query('SELECT * FROM meal_types WHERE name = ?', [name])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
  }

  static async getAll (result) {
    return db.query('SELECT * FROM meal_types');
  }

  static async updateById (id, meal_types) {
    return db
      .query('UPDATE meal_types SET name = ? WHERE id = ?', [
        meal_types.name,
        id
      ])
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM meal_types WHERE id = ?', id).then((res) => {
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
    return db.query('DELETE FROM meal_types');
  }
}

module.exports = meal_types;
