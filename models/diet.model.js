const db = require('../db.js');

class DietTypes {
  constructor (dietTypes) {
    this.id = dietTypes.id;
    this.name = dietTypes.name;
  }

  static async create (newDietTypes) {
    return db
      .query('INSERT INTO diets SET ?', newDietTypes)
      .then((res) => {
        newDietTypes.id = res.insertId;
        return newDietTypes;
      });
  }

  static async findById (id) {
    return db
      .query('SELECT * FROM diets WHERE id = ?', [id])
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
      .query('SELECT * FROM diets WHERE name = ?', [name])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
  }

  static async getAll (result) {
    return db.query('SELECT * FROM diets');
  }

  static async getSome (limit, offset) {
    const total = await db.query('select count(id) as count from diets').then(rows => rows[0].count);
    let sql = 'select * from diets';
    if (limit !== undefined && offset !== undefined) {
      sql += ` limit ${limit} offset ${offset}`;
    }
    return db.query(sql).then(rows => ({
      results: rows.map(d => new DietTypes(d)),
      total
    }));
  }

  static async updateById (id, dietTypes) {
    return db
      .query('UPDATE diets SET name = ? WHERE id = ?', [
        dietTypes.name,
        id
      ])
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM diets WHERE id = ?', id).then((res) => {
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
    return db.query('DELETE FROM diets');
  }
}

module.exports = DietTypes;
