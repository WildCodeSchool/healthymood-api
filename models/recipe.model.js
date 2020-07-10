const db = require('../db.js');
// const { query } = require('../db.js');

class Recipe {
  constructor (recipe) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.image = recipe.image;
    this.content = recipe.content;
    this.created_at = recipe.created_at;
    this.updated_at = recipe.updated_at;
    this.preparation_duration_seconds = recipe.preparation_duration_seconds;
    this.budget = recipe.budget;
    this.slug = recipe.slug;
    this.calories = recipe.calories;
    this.published = recipe.published;
    this.user_id = recipe.user_id;
  }

  static async create (newRecipe) {
    return db.query('INSERT INTO recipes SET ?', newRecipe).then((res) => {
      newRecipe.id = res.insertId;
      return newRecipe;
    });
  }

  static async findById (id) {
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

  static async findBySlug (slug) {
    console.log(slug);
    return db
      .query('SELECT * FROM recipes WHERE slug = ?', [slug])
      .then((rows) => {
        console.log(rows);
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
  static async getRecipeIngredients(recipe_id) {
    return db.query(
      'SELECT * FROM recipes LEFT JOIN recipe_ingredient_quantities riq ON recipes.id = riq.recipe_id JOIN ingredients ON ingredients.id = riq.ingredient_id WHERE recipe_id = ?',
      [recipe_id] // eslint-disable-line
    );
  }

  static async findByKeyWord (query) {
    // const keyword = query.search;
    console.log(query);
    const mealTypes = query.meal_types;
    const mealTypesIntToString = mealTypes.map(mealtype => parseInt(mealtype)).toString();
    console.log(mealTypesIntToString);

    // const sqlKeyword = `%${keyword}%`;
    const sqlMealTypes = mealTypesIntToString;
    // UNION SELECT name FROM recipes WHERE recipes.name LIKE ? OR recipes.content LIKE ?
    return db.query(

      'SELECT DISTINCT recipes.name FROM meal_type_recipes INNER JOIN recipes ON meal_type_recipes.recipe_id = recipes.id WHERE meal_type_recipes.meal_type_id IN (?)',
      [sqlMealTypes]
    );
  }

  static async getAll (result) {
    return db.query('SELECT * FROM recipes');
  }

  static async updateById (id, recipe) {
    return db
      .query(
        'UPDATE recipes SET name = ?, content = ?, image = ?, created_at = ?, updated_at = ?, preparation_duration_seconds = ?, budget = ?, slug = ?, calories = ?, published = ?, user_id = ?  WHERE id = ?',
        [
          recipe.name,
          recipe.content,
          recipe.image,
          recipe.created_at,
          recipe.updated_at,
          recipe.preparation_duration_seconds,
          recipe.budget,
          recipe.slug,
          recipe.calories,
          recipe.published,
          recipe.user_id,
          id
        ]
      )
      .then(() => this.findById(id));
  }

  static async remove (id) {
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

  static async removeAll (result) {
    return db.query('DELETE FROM recipes');
  }
}

module.exports = Recipe;
