const db = require('../db.js');

class Recipe {
  constructor(recipe) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.image = recipe.image;
    this.content = recipe.content;
    this.created_at = recipe.created_at;
    this.updated_at = recipe.updated_at;
    this.preparation_duration_seconds = recipe.preparation_duration_seconds;
    this.budget = recipe.budget;
    this.slug = recipe.slug;
    this.published = recipe.published;
    this.user_id = recipe.user_id;
  }

  static async create(newRecipe) {
    return db.query('INSERT INTO recipes SET ?', newRecipe).then((res) => {
      newRecipe.id = res.insertId;
      return newRecipe;
    });
  }

  static async findById(id) {
    return db.query('SELECT * FROM recipes WHERE id = ?', [id]).then((rows) => {
      if (rows.length) {
        return Promise.resolve(rows[0]);
      } else {
        const err = new Error();
        err.kind = 'not_found';
        return Promise.reject(err);
      }
    });
  }

  static async findByKeyWord(keyword) {
    const sqlValues = `%${keyword}%`;
    return db.query(
      'SELECT * FROM recipes WHERE name LIKE ? OR content LIKE ?',
      [sqlValues, sqlValues]
    );
  }

  static async getAll(result) {
    return db.query('SELECT * FROM recipes');
  }

  static async updateById(id, recipe) {
    return db
      .query(
        'UPDATE recipes SET name = ?, content = ?, image = ?, created_at = ?, updated_at = ?, preparation_duration_seconds = ?, budget = ?, slug = ?, published = ?, user_id = ?  WHERE id = ?',
        [
          recipe.name,
          recipe.content,
          recipe.image,
          recipe.created_at,
          recipe.updated_at,
          recipe.preparation_duration_seconds,
          recipe.budget,
          recipe.slug,
          recipe.published,
          recipe.user_id,
          id
        ]
      )
      .then(() => this.findById(id));
  }

  static async remove(id) {
    return db.query('DELETE FROM recipes WHERE id = ?', id).then((res) => {
      if (res.affectedRows !== 0) {
        return Promise.resolve();
      } else {
        const err = new Error();
        err.kind = 'not_found';
        return Promise.reject(err);
      }
    });
  }

  static async removeAll(result) {
    return db.query('DELETE FROM recipes');
  }
}

module.exports = Recipe;
