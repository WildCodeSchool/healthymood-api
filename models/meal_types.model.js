const db = require('../db.js');

class MealTypes {
  constructor (mealTypes) {
    this.id = mealTypes.id;
    this.name = mealTypes.name;
  }

  static async create (newMealTypes) {
    return db
      .query('INSERT INTO meal_types SET ?', newMealTypes)
      .then((res) => {
        newMealTypes.id = res.insertId;
        return newMealTypes;
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

  static async getSome (limit, offset) {
    const total = await db.query('select count(id) as count from meal_types').then(rows => rows[0].count);
    let sql = 'select * from meal_types';
    if (limit !== undefined && offset !== undefined) {
      sql += ` limit ${limit} offset ${offset}`;
    }
    return db.query(sql).then(rows => ({
      results: rows.map(mt => new MealTypes(mt)),
      total
    }));
  }

  static async updateById (id, mealTypes) {
    return db
      .query('UPDATE meal_types SET name = ? WHERE id = ?', [
        mealTypes.name,
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

module.exports = MealTypes;
