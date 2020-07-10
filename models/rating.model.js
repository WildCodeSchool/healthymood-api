const db = require('../db.js');

class Rating {
  constructor (rating) {
    this.id = rating.id;
    this.score = rating.score;
    this.recipe_id = rating.recipe_id;
    this.user_id = rating.user_id;
  }

  static async create (newRating) {
    return db.query('INSERT INTO ratings SET ?', newRating).then((res) => {
      newRating.id = res.insertId;
      return newRating;
    });
  }

  static async findById (id) {
    return db.query('SELECT * FROM ratings WHERE id = ?', [id]).then((rows) => {
      if (rows.length) {
        return Promise.resolve(rows[0]);
      } else {
        const err = new Error();
        err.kind = 'not_found';
        return Promise.reject(err);
      }
    });
  }
  // eslint-disable-next-line
  static async find(recipe_id, user_id) {
    return db
      .query('SELECT * FROM ratings WHERE recipe_id = ? AND user_id = ?', [
        recipe_id, // eslint-disable-line
        user_id, // eslint-disable-line
      ])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(rows[0]);
        } else {
          return null;
        }
      });
  }

  static async getAll (result) {
    return db.query('SELECT * FROM ratings');
  }

  static async updateById (id, rating) {
    return db
      .query('UPDATE ratings SET score = ? WHERE id = ?', [rating.score, id])
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM ratings WHERE id = ?', id).then((res) => {
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
    return db.query('DELETE FROM ratings');
  }
}

module.exports = Rating;
