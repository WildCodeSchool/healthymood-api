const Recipe = require('../models/recipe.model.js');
const Rating = require('../models/rating.model.js');
const Favorite = require('../models/favorite.model.js');
const { tryParseInt } = require('../helpers/number');
const { getServerBaseURL } = require('../helpers/url');

class RecipesController {
  static async create (req, res) {
    if (!req.body) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }

    if (!req.body.slug) {
      return res.status(400).send({ errorMessage: 'Name can not be empty!' });
    } else if (!req.body.content) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }
    const user_id = req.currentUser.id;// eslint-disable-line
    try {
      if (await Recipe.slugAlreadyExists(req.body.slug)) {
        res.status(400).send({
          errorMessage: 'An Recipe with this slug already exists !'
        });
      } else {
        const recipe = new Recipe({ ...req.body, user_id: user_id });
        recipe.image = recipe.image ? ('/uploads/' + recipe.image.split('uploads/')[1]) : null;

        const data = await Recipe.create(recipe);
        if (req.body.ingredients && req.body.ingredients.length > 0) {
          for (let i = 0; i < req.body.ingredients.length; i++) {
            const ingredient = req.body.ingredients[i];
            await Recipe.addIngredient(ingredient.value, recipe.id);
          }
        }
        if (req.body.dish_types && req.body.dish_types.length > 0) {
          for (let i = 0; i < req.body.dish_types.length; i++) {
            const dish_type = req.body.dish_types[i];// eslint-disable-line
            await Recipe.addDish(dish_type.value, data.id);
          }
        }
        if (req.body.meal_types && req.body.meal_types.length > 0) {
          for (let i = 0; i < req.body.meal_types.length; i++) {
            const meal_type = req.body.meal_types[i];// eslint-disable-line
            await Recipe.addMeal(meal_type.value, data.id);
          }
        }
        if (req.body.diets && req.body.diets.length > 0) {
          for (let i = 0; i < req.body.diets.length; i++) {
            const diet = req.body.diets[i];
            await Recipe.addDiet(diet.value, data.id);
          }
        }
        if (req.body.recipe_category) {
          await Recipe.setCategory(data.id, req.body.recipe_category.value);
        }
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the Recipe.'
      });
    }
  }

  static async findAll (req, res) {
    const fullUrl = getServerBaseURL(req);
    if (Object.keys(req.query).length !== 0) {
      try {
        const page = tryParseInt(req.query.page, 1);
        const perPage = tryParseInt(req.query.per_page, 8);
        const limit = perPage;
        const offset = (page - 1) * limit;
        const rangeEnd = page * perPage;
        const rangeBegin = rangeEnd - perPage + 1;
        const { results, total } = await Recipe.getSome(limit, offset, req.query);
        res.header('content-range', `${rangeBegin}-${rangeEnd}/${total}`);
        res.send({ data: results.map(r => ({ ...r, image: r.image ? (fullUrl + r.image) : null })), total: total });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          errorMessage:
            'Error retrieving Recipe with keyword ' + req.query.search
        });
      }
    } else {
      try {
        const data = (await Recipe.getAll())
          .map((r) => new Recipe(r))
          .map((r) => ({
            id: r.id,
            name: r.name,
            content: r.content,
            created_at: r.created_at,
            updated_at: r.updated_at,
            preparation_duration_seconds: r.preparation_duration_seconds,
            budget: r.budget,
            slug: r.slug,
            published: r.published,
            user_id: r.user_id,
            image: r.image,
            intro: r.intro
          }));
        res.send({ data: data.map(r => ({ ...r, image: r.image ? (fullUrl + r.image) : null })) });
      } catch (err) {
        res.status(500).send({
          errorMessage:
            err.message || 'Some error occurred while retrieving recipes.'
        });
      }
    }
  }

  static async findFavoriteByUser_ID(req, res) { // eslint-disable-line
    const fullUrl = getServerBaseURL(req);

    try {
      const data = await Recipe.findRecipeByUser_ID(req.currentUser.id) // eslint-disable-line
      res.send({ data: data.map(r => ({ ...r, image: r.image ? (fullUrl + r.image) : null })) });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: 'hmmm, seems like there is no favorite.'
        });
      } else {
        res.status(500).send({
          errorMessage:
            err.message || 'Some error occurred while retrieving recipes.'
        });
      }
    }
  }

  static async findOne (req, res) {
    const fullUrl = getServerBaseURL(req);
    try {
      const slugOrId = req.params.id;
      let data = null;
      if (isNaN(parseInt(slugOrId))) {
        data = await Recipe.findBySlug(slugOrId);
      } else {
        data = await Recipe.findById(req.params.id);
      }

      let ingredients = [];
      let category = null;
      let author = null;
      let dish_types = [];// eslint-disable-line
      let diets = [];
      let mealType = [];
      let user_rating = null; // eslint-disable-line
      let user_favorite = null; // eslint-disable-line

      try {
        ingredients = await Recipe.getRecipeIngredients(data.id);
        dish_types = await Recipe.getRecipeDishTypes(data.id);// eslint-disable-line
        category = await Recipe.getRecipeCategory(data.id);
        author = await Recipe.getRecipeAuthor(data.user_id);
        mealType = await Recipe.getMealTypeCategorie(data.id);
        diets = await Recipe.getDiets(data.id);
      } catch (err) {
        console.error(err);
      }

      if (req.currentUser) {
        user_rating = await Rating.find(data.id, req.currentUser.id); // eslint-disable-line
        user_favorite = await Favorite.find(data.id, req.currentUser.id); // eslint-disable-line
      }

      res.send({
        data: { ...data, ingredients, user_rating, diets, category, dish_types, author, mealType, image: data.image ? (fullUrl + data.image) : null }
      });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Recipe with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving Recipe with id ' + req.params.id
        });
      }
    }
  }

  static async findLastRecipes (req, res) {
    const fullUrl = getServerBaseURL(req);
    try {
      const data = (await Recipe.getLastRecipes())
        .map((r) => new Recipe(r))
        .map((r) => ({
          id: r.id,
          name: r.name,
          content: r.content,
          created_at: r.created_at,
          updated_at: r.updated_at,
          preparation_duration_seconds: r.preparation_duration_seconds,
          budget: r.budget,
          slug: r.slug,
          published: r.published,
          user_id: r.user_id,
          image: r.image,
          intro: r.intro
        }));
      res.send({ data: data.map(r => ({ ...r, image: r.image ? (fullUrl + r.image) : null })) });
    } catch (err) {
      res.status(500).send({
        errorMessage:
            err.message || 'Some error occurred while retrieving last recipes.'
      });
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }
    try {
      const recipe = new Recipe(req.body);
      recipe.image = recipe.image ? ('/uploads/' + recipe.image.split('uploads/')[1]) : null;

      const data = await Recipe.updateById(req.params.id, recipe);
      if (req.body.ingredients && req.body.ingredients.length > 0) {
        await Recipe.deleteAllIngredient(data.id);
        for (let i = 0; i < req.body.ingredients.length; i++) {
          const ingredient = req.body.ingredients[i];
          await Recipe.addIngredient(ingredient.value, data.id);
        }
      }
      if (req.body.dish_types && req.body.dish_types.length > 0) {
        await Recipe.deleteAllDish(data.id);
        for (let i = 0; i < req.body.dish_types.length; i++) {
          const dish_type = req.body.dish_types[i];// eslint-disable-line
          await Recipe.addDish(dish_type.value, data.id);
        }
      }
      if (req.body.meal_types && req.body.meal_types.length > 0) {
        await Recipe.deleteAllMeal(data.id);
        for (let i = 0; i < req.body.meal_types.length; i++) {
          const meal_type = req.body.meal_types[i];// eslint-disable-line
          await Recipe.addMeal(meal_type.value, data.id);
        }
      } if (req.body.diets && req.body.diets.length > 0) {
        await Recipe.deleteAllDiet(data.id);
        for (let i = 0; i < req.body.diets.length; i++) {
          const diet = req.body.diets[i];
          await Recipe.addDiet(diet.value, data.id);
        }
      } if (req.body.recipe_category) {
        await Recipe.setCategory(data.id, req.body.recipe_category.value);
      }

      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Recipe with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating Recipe with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await Recipe.remove(req.params.id);
      res.send({ message: 'Recipe was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found Recipe with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete Recipe with id ' + req.params.id
        });
      }
    }
  }

  static async upload (req, res) {
    const fullUrl = getServerBaseURL(req);
    try {
      const picture = req.file ? req.file.path.replace('\\', '/') : null;
      res.status(200).send(fullUrl + '/' + picture);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  }
}

module.exports = RecipesController;
