const db = require('../db.js');

class Favorite {
  constructor (favorite) {
    this.id = favorite.id;
    this.recipe_id = favorite.recipe_id;
    this.user_id = favorite.user_id;
  }

  static async create (newFavorite) {
    return db.query('INSERT INTO user_favorites SET ?', newFavorite).then((res) => {
      newFavorite.id = res.insertId;
      return newFavorite;
    });
  }

  static async findById (id) {
    return db
      .query('SELECT * FROM user_favorites WHERE id = ?', [id])
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

  static async find(user_id, recipe_id) { // eslint-disable-line
    return db
      .query('SELECT * FROM user_favorites WHERE user_id = ? and recipe_id = ?', [
        user_id,  // eslint-disable-line
        recipe_id, // eslint-disable-line
      ])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(rows[0]);
        } else {
          return null;
        }
      });
  }

  static async getAll(user_id) { // eslint-disable-line
    return db.query('SELECT * FROM user_favorites WHERE user_id = ? ', [user_id]); // eslint-disable-line
  }

  static async updateById (id, favorite) {
    return db
      .query('UPDATE user_favorites SET id = ? WHERE id = ?', [favorite.id, id])
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db
      .query('DELETE FROM user_favorites WHERE id = ?', id)
      .then((res) => {
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
    return db.query('DELETE FROM user_favorites');
  }
}

module.exports = Favorite;
