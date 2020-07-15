const db = require('../db.js');

class MealTypeRecipes {
  constructor (mealTypeRecipes) {
    this.id = mealTypeRecipes.id;
    this.meal_type_id = mealTypeRecipes.meal_type_id;
    this.recipe_id = mealTypeRecipes.recipe_id;
  }

  static async create (newMealTypeRecipes) {
    return db
      .query('INSERT INTO meal_type_recipes SET ?', newMealTypeRecipes)
      .then((res) => {
        newMealTypeRecipes.id = res.insertId;
        return newMealTypeRecipes;
      });
  }

  static async findById (id) {
    return db
      .query('SELECT * FROM meal_type_recipes WHERE id = ?', [id])
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

  static async getAll (result) {
    return db.query('SELECT * FROM meal_type_recipes');
  }

  static async updateById (id, mealTypeRecipes) {
    return db
      .query('UPDATE meal_type_recipes SET recipe_id = ?, meal_type_id = ? WHERE id = ?', [
        mealTypeRecipes.recipe_id,
        mealTypeRecipes.meal_type_id,
        id
      ])
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM meal_type_recipes WHERE id = ?', id).then((res) => {
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
    return db.query('DELETE FROM meal_type_recipes');
  }
}

module.exports = MealTypeRecipes;
