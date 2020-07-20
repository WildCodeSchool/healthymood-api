const Recipe = require('../models/recipe.model.js');
const Rating = require('../models/rating.model.js');

class RecipesController {
  static async create(req, res) {
    if (!req.body) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }

    if (!req.body.slug) {
      return res.status(400).send({ errorMessage: 'slug can not be empty!' });
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
        const fullUrl = req.protocol + '://' + req.get('host');
        const imageRelativeUrl = req.body.image.replace(fullUrl, '');
        recipe.image = imageRelativeUrl;
        const data = await Recipe.create(recipe);
        if (req.body.ingredients && req.body.ingredients.length > 0) {
          for (let i = 0; i < req.body.ingredients.length; i++) {
            const ingredient = req.body.ingredients[i];
            await Recipe.addIngredient(ingredient.value, recipe.id);
          }
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

  static async findAll(req, res) {
    const fullUrl = req.protocol + '://' + req.get('host');
    if (req.query.search) {
      try {
        const data = await Recipe.findByKeyWord(req.query.search);
        res.send({ data: data.map(r => ({ ...r, image: r.image ? (fullUrl + r.image) : null })) });
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
            image: r.image
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

  static async findOne(req, res) {
    const fullUrl = req.protocol + '://' + req.get('host');
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
      let mealType = [];
      let user_rating = null; // eslint-disable-line

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
      }

      res.send({
        data: { ...data, ingredients, user_rating, category, author, mealType, image: fullUrl + data.image }
      });
    } catch (err) {
      console.log(err);
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

  static async update(req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }
    try {
      const recipe = new Recipe(req.body);
      const fullUrl = req.protocol + '://' + req.get('host');
      const imageRelativeUrl = req.body.image.replace(fullUrl, '');
      recipe.image = imageRelativeUrl;
      const data = await Recipe.updateById(req.params.id, recipe);
      if (req.body.ingredients && req.body.ingredients.length > 0) {
        await Recipe.deleteAllIngredient(data.id);
        for (let i = 0; i < req.body.ingredients.length; i++) {
          const ingredient = req.body.ingredients[i];
          await Recipe.addIngredient(ingredient.value, data.id);
        }
      }
      res.send({ data });
    } catch (err) {


      console.log(err);
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

  static async delete(req, res) {
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

  static async upload(req, res) {
    const fullUrl = req.protocol + '://' + req.get('host');
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
