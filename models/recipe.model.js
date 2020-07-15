const db = require('../db.js');

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
    this.published = recipe.published;
    this.user_id = recipe.user_id;
    this.calories = recipe.calories;
    this.intro = recipe.intro;
  }

  static async create (newRecipe) {
    return db.query('INSERT INTO recipes SET ?', newRecipe).then((res) => {
      newRecipe.id = res.insertId;
      return newRecipe;
    });
  }

  static async nameAlreadyExists (slug) {
    return db
      .query('SELECT * FROM recipes WHERE slug = ?', [slug])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
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
    return db
      .query('SELECT * FROM recipes WHERE slug = ?', [slug])
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
  // eslint-disable-next-line
  static async getRecipeIngredients(recipe_id) {
    return db.query(
      'SELECT * FROM recipes LEFT JOIN recipe_ingredient_quantities riq ON recipes.id = riq.recipe_id JOIN ingredients ON ingredients.id = riq.ingredient_id WHERE recipe_id = ?',
      [recipe_id] // eslint-disable-line
    );
  }
  // eslint-disable-next-line
  static async getRecipeCategorie(recipe_categories) {
    return db
      .query(
        'SELECT recipe_categories.name FROM recipes LEFT JOIN recipe_categories ON recipe_categories.id = recipes.recipe_category_id WHERE recipe_categories.id = ?',
        [recipe_categories] // eslint-disable-line
      )
      .then((rows) => {
        console.log(rows[0]);
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
  static async getMealTypeCategorie(recipe_id) {
    return db
      .query(
        'SELECT meal_types.name FROM recipes LEFT JOIN meal_type_recipes mtr ON recipes.id = mtr.recipe_id JOIN meal_types ON meal_types.id = mtr.recipe_id WHERE recipe_id = ?',
        [recipe_id] // eslint-disable-line
      )
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
  static async getRecipeAuthor(user_id) {
    return db
      .query(
        'SELECT users.username FROM recipes LEFT JOIN users ON users.id = recipes.user_id WHERE user_id = ?', // eslint-disable-next-line
        [user_id]
      )
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

  static async search (query) {
    console.log(query);
    const mealTypesID = query.meal_types ? query.meal_types.map(mealtype => parseInt(mealtype)) : null;
    const keyword = query.search ? `%${query.search}%` : null;
    const ingredientsID = query.ingredients ? query.ingredients.map(ingredient => parseInt(ingredient)) : null;
    const dietsID = query.diets ? query.diets.map(diet => parseInt(diet)) : null;
    const calories = query.calories > 0 ? query.calories : null;

    return db.query(
      'SELECT DISTINCT recipes.name, recipes.image, recipes.intro, recipes.content, recipes.created_at, recipes.updated_at, recipes.preparation_duration_seconds, recipes.slug, recipes.published, recipes.user_id, recipes.calories FROM recipes LEFT JOIN meal_type_recipes ON meal_type_recipes.recipe_id = recipes.id LEFT JOIN recipe_ingredient_quantities ON recipe_ingredient_quantities.recipe_id = recipes.id LEFT JOIN diet_recipes ON diet_recipes.recipe_id = recipes.id WHERE (? is NULL OR meal_type_recipes.meal_type_id IN (?))  AND (? is NULL OR recipe_ingredient_quantities.ingredient_id IN (?)) AND (? is NULL OR diet_recipes.diet_id IN (?)) AND (? is NULL OR recipes.name LIKE ? OR recipes.content LIKE ?) AND (? is NULL or recipes.calories <= ?)',
      [mealTypesID ? mealTypesID[0] : null, mealTypesID, ingredientsID ? ingredientsID[0] : null, ingredientsID, dietsID ? dietsID[0] : null, dietsID, keyword, keyword, keyword, calories, calories]
    ); //
  }

  static async getAll (result) {
    return db.query('SELECT * FROM recipes');
  }

  static async updateById (id, recipe) {
    return db
      .query(
        'UPDATE recipes SET name = ?, content = ?, image = ?, updated_at = ?, preparation_duration_seconds = ?, budget = ?, slug = ?, published = ?, user_id = ?, intro = ? WHERE id = ?',
        [
          recipe.name,
          recipe.content,
          recipe.image,
          recipe.updated_at,
          recipe.preparation_duration_seconds,
          recipe.budget,
          recipe.slug,
          recipe.published,
          recipe.user_id,
          recipe.intro,
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
