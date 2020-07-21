const db = require('../db.js');

class DishTypes {
  constructor (dishTypes) {
    this.id = dishTypes.id;
    this.name = dishTypes.name;
  }

  static async create (newDishTypes) {
    return db
      .query('INSERT INTO dish_types SET ?', newDishTypes)
      .then((res) => {
        newDishTypes.id = res.insertId;
        return newDishTypes;
      });
  }

  static async findById (id) {
    return db
      .query('SELECT * FROM dish_types WHERE id = ?', [id])
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
      .query('SELECT * FROM dish_types WHERE name = ?', [name])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
  }

  static async getAll (result) {
    return db.query('SELECT * FROM dish_types');
  }

  static async getSome (limit, offset) {
    const total = await db.query('select count(id) as count from dish_types').then(rows => rows[0].count);
    let sql = 'select * from dish_types';
    if (limit !== undefined && offset !== undefined) {
      sql += ` limit ${limit} offset ${offset}`;
    }
    return db.query(sql).then(rows => ({
      results: rows.map(dt => new DishTypes(dt)),
      total
    }));
  }

  static async updateById (id, dishTypes) {
    return db
      .query('UPDATE dish_types SET name = ? WHERE id = ?', [
        dishTypes.name,
        id
      ])
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM dish_types WHERE id = ?', id).then((res) => {
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
    return db.query('DELETE FROM dish_types');
  }
}

module.exports = DishTypes;
