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

  static async getAll(result) {// eslint-disable-line
    return db.query('SELECT * FROM recipes');
  }

  static async slugAlreadyExists (slug) {
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

  static async findRecipeByUser_ID(user_id) { // eslint-disable-line
    return db
      .query('SELECT recipes.name, recipes.content, recipes.slug, recipes.id, recipes.image, recipes.intro FROM recipes LEFT JOIN user_favorites uf ON uf.recipe_id = recipes.id JOIN users ON users.id = uf.user_id WHERE users.id = ?', [user_id]) // eslint-disable-line
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(rows);
        } else {
          const err = new Error();
          err.kind = 'not_found';
          return Promise.reject(err);
        }
      });
  }

  static async findById (id) {
    return db.query('SELECT * FROM recipes WHERE id = ?', [id])
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
      'SELECT i.id,i.name FROM recipes LEFT JOIN recipe_ingredient_quantities riq ON recipes.id = riq.recipe_id JOIN ingredients  AS i ON i.id = riq.ingredient_id WHERE recipe_id = ?',
      [recipe_id] // eslint-disable-line
    );
  }

  // eslint-disable-next-line
  static async getRecipeDishTypes(recipe_id) {
    return db.query(
      'SELECT d.id,d.name FROM recipes LEFT JOIN dish_type_recipes dtr ON recipes.id = dtr.recipe_id JOIN dish_types AS d ON d.id = dtr.dish_type_id WHERE recipe_id = ?',
      [recipe_id] // eslint-disable-line
    );
  }

  // eslint-disable-next-line
  static async getRecipeCategory(recipe_id) {
    return db
      .query(
        'SELECT rc.name,rc.id FROM recipe_categories rc JOIN recipes ON rc.id = recipes.recipe_category_id WHERE recipes.id = ?',
        [recipe_id] // eslint-disable-line
      )
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(rows[0]);
        } else {
          return Promise.resolve(null);
        }
      });
  }

  // eslint-disable-next-line
  static async getMealTypeCategorie(recipe_id) {
    return db
      .query(
        'SELECT mt.name,mt.id FROM meal_type_recipes mtr JOIN meal_types mt ON mtr.meal_type_id = mt.id WHERE mtr.recipe_id = ?',
        [recipe_id] // eslint-disable-line
      );
  }

  static async getDiets(recipe_id) {// eslint-disable-line
    return db
      .query(
        'SELECT d.name,d.id FROM diet_recipes dr JOIN diets d ON diet_id = d.id WHERE dr.recipe_id = ?',
        [recipe_id] // eslint-disable-line
      );
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

  static async getSome (limit, offset, query) {
    const mealTypesID = (query && query.meal_types) ? query.meal_types.map(mealtype => parseInt(mealtype)) : null;
    const keyword = (query && query.search) ? `%${query.search}%` : null;
    const ingredientsID = (query && query.ingredients) ? query.ingredients.map(ingredient => parseInt(ingredient)) : null;
    const dietsID = (query && query.diets) ? query.diets.map(diet => parseInt(diet)) : null;
    const calories = (query && query.calories > 0) ? query.calories : null;
    const sqltotal = 'select distinct count(id) as count from recipes';
    let total = 0;
    let sql = 'select distinct recipes.* from recipes';

    if (query) {
      const searchSQL = `
        LEFT JOIN meal_type_recipes ON meal_type_recipes.recipe_id = recipes.id 
        LEFT JOIN recipe_ingredient_quantities ON recipe_ingredient_quantities.recipe_id = recipes.id 
        LEFT JOIN diet_recipes ON diet_recipes.recipe_id = recipes.id 
        WHERE (? is NULL OR meal_type_recipes.meal_type_id IN (?)) 
        AND (? is NULL OR recipe_ingredient_quantities.ingredient_id IN (?)) 
        AND (? is NULL OR diet_recipes.diet_id IN (?)) 
        AND (? is NULL OR recipes.name LIKE ? OR recipes.content LIKE ?) 
        AND (? is NULL or recipes.calories <= ?)
      `;
      total = await db.query(`SELECT COUNT(distinct recipes.id) AS count FROM recipes ${searchSQL}`,
        [
          mealTypesID ? mealTypesID[0] : null,
          mealTypesID,
          ingredientsID ? ingredientsID[0] : null,
          ingredientsID, dietsID ? dietsID[0] : null,
          dietsID, keyword, keyword, keyword, calories, calories
        ]
      ).then(rows => rows[0].count);

      sql += searchSQL;
    } else {
      total = await db.query(sqltotal).then(rows => rows[0].count);
    }
    sql += 'ORDER BY recipes.id DESC';
    if (limit !== undefined && offset !== undefined) {
      sql += ` limit ${limit} offset ${offset}`;
    }

    return db.query(sql,
      query ? [
        mealTypesID ? mealTypesID[0] : null,
        mealTypesID,
        ingredientsID ? ingredientsID[0] : null,
        ingredientsID, dietsID ? dietsID[0] : null, dietsID, keyword, keyword, keyword, calories, calories
      ] : []
    ).then(rows => ({
      results: rows.map(r => new Recipe(r)),
      total
    }));
  }

  static async setCategory(recipe_id, category_id) {// eslint-disable-line
    return db.query('UPDATE recipes SET recipe_category_id = ? WHERE id = ? ', [category_id, recipe_id]);// eslint-disable-line
  }

  static async getLastRecipes (result) {
    return db.query('SELECT * FROM recipes ORDER BY recipes.created_at DESC LIMIT 3');
  }

  static async updateById (id, recipe) {
    return db
      .query(
        'UPDATE recipes SET name = ?, content = ?, image = ?, updated_at = ?, preparation_duration_seconds = ?, calories = ?, budget = ?, slug = ?, published = ?, user_id = ?, intro = ? WHERE id = ?',
        [
          recipe.name,
          recipe.content,
          recipe.image,
          // recipe.created_at,
          recipe.updated_at,
          recipe.preparation_duration_seconds,
          recipe.calories,
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

  static async removeAll(result) { // eslint-disable-line
    return db.query('DELETE FROM recipes');
  }

  static async addIngredient(ingredient_id, recipe_id) {// eslint-disable-line
    return db.query('INSERT INTO recipe_ingredient_quantities  (ingredient_id , recipe_id ) values (?,?)', [ingredient_id, recipe_id]); // eslint-disable-line
  }

  static async deleteAllIngredient(recipe_id) {// eslint-disable-line
    return db.query('DELETE FROM recipe_ingredient_quantities  WHERE recipe_id = ? ', [recipe_id]); // eslint-disable-line
  }
  static async addDish(dish_type_id, recipe_id) {// eslint-disable-line
    return db.query('INSERT INTO dish_type_recipes  (dish_type_id , recipe_id ) values (?,?)', [dish_type_id, recipe_id]); // eslint-disable-line
  }

  static async deleteAllDish(recipe_id) {// eslint-disable-line
    return db.query('DELETE FROM dish_type_recipes  WHERE recipe_id = ? ', [recipe_id]); // eslint-disable-line
  }
  static async addMeal(meal_type_id, recipe_id) {// eslint-disable-line
    return db.query('INSERT INTO meal_type_recipes  (meal_type_id , recipe_id ) values (?,?)', [meal_type_id, recipe_id]); // eslint-disable-line
  }

  static async deleteAllMeal(recipe_id) {// eslint-disable-line
    return db.query('DELETE FROM meal_type_recipes  WHERE recipe_id = ? ', [recipe_id]); // eslint-disable-line
  }
  static async addDiet(diet_id, recipe_id) {// eslint-disable-line
    return db.query('INSERT INTO diet_recipes  (diet_id , recipe_id ) values (?,?)', [diet_id, recipe_id]); // eslint-disable-line
  }

  static async deleteAllDiet(recipe_id) {// eslint-disable-line
    return db.query('DELETE FROM diet_recipes  WHERE recipe_id = ? ', [recipe_id]); // eslint-disable-line
  }
}

module.exports = Recipe;
