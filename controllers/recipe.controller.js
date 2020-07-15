const Recipe = require('../models/recipe.model.js');
const Rating = require('../models/rating.model.js');
const Favorite = require('../models/favorite.model.js');

class RecipesController {
  static async create (req, res) {
    if (!req.body) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }

    if (!req.body.name) {
      return res.status(400).send({ errorMessage: 'Name can not be empty!' });
    } else if (!req.body.content) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const recipe = new Recipe(req.body);
      const data = await Recipe.create(recipe);
      res.status(201).send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the Recipe.'
      });
    }
  }

  static async findAll (req, res) {
    if (Object.keys(req.query).length !== 0) {
      console.log(req.query);
      try {
        console.log('rentre dans search');
        const data = await Recipe.search(req.query);
        res.send({ data });
        console.log(data);
      } catch (err) {
        if (err.kind === 'not_found') {
          res.status(404).send({
            errorMessage: `Recipe with keyword ${req.query.search} not found.`
          });
        } else {
          res.status(500).send({
            errorMessage:
              'Error retrieving Recipe with keyword ' + req.query.search
          });
        }
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
            calories: r.calories,
            intro: r.intro
          }));
        res.send({ data });
      } catch (err) {
        res.status(500).send({
          errorMessage:
            err.message || 'Some error occurred while retrieving recipes.'
        });
      }
    }
  }

  static async findFavoriteByUser_ID(req, res) { // eslint-disable-line
    try {
      const data = await Recipe.findRecipeByUser_ID(req.currentUser.id) // eslint-disable-line
      res.send({ data });
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
    try {
      const slugOrId = req.params.id;
      let data = null;
      if (isNaN(parseInt(slugOrId))) {
        data = await Recipe.findBySlug(slugOrId);
      } else {
        data = await Recipe.findById(req.params.id);
      }
      console.log(data);

      let ingredients = [];
      let category = null;
      let author = null;
      let mealType = [];
      let user_rating = null; // eslint-disable-line
      let user_favorite = null; // eslint-disable-line

      try {
        ingredients = await Recipe.getRecipeIngredients(data.id);
        category = await Recipe.getRecipeCategorie(data.recipe_category_id);
        author = await Recipe.getRecipeAuthor(data.user_id);
        mealType = await Recipe.getMealTypeCategorie(data.id);
      } catch (err) {
        console.error(err);
      }

      if (req.currentUser) {
        user_rating = await Rating.find(data.id, req.currentUser.id); // eslint-disable-line
        user_favorite = await Favorite.find(data.id, req.currentUser.id); // eslint-disable-line
      }

      res.send({
        data: { ...data, ingredients, user_rating, user_favorite, category, author, mealType }
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

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await Recipe.updateById(req.params.id, new Recipe(req.body));
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
      console.log(err);
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
}

module.exports = RecipesController;
