const db = require('../db.js');

class Ingredient {
  constructor (ingredient) {
    this.id = ingredient.id;
    this.name = ingredient.name;
    this.is_allergen = ingredient.is_allergen;
    this.calories = ingredient.calories;
  }

  static async create (newIngredient) {
    return db
      .query('INSERT INTO ingredients SET ?', newIngredient)
      .then((res) => {
        newIngredient.id = res.insertId;
        return newIngredient;
      });
  }

  static async findById (id) {
    return db
      .query(`SELECT * FROM ingredients WHERE id = ${id}`)
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
      .query('SELECT * FROM ingredients WHERE name = ?', [name])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
  }

  static async getAll (result) {
    return db.query('SELECT * FROM ingredients');
  }

  static async updateById (id, ingredient) {
    return db
      .query('UPDATE ingredients SET name = ?, is_allergen = ? , calories = ? WHERE id = ?', [
        ingredient.name,
        ingredient.is_allergen,
        ingredient.calories,
        id
      ])
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM ingredients WHERE id = ?', id).then((res) => {
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
    return db.query('DELETE FROM ingredients');
  }
}

module.exports = Ingredient;
