const MealTypeRecipes = require('../models/meal_type_recipes.model.js');

class MealTypeRecipesController {
  static async create (req, res) {
    if (!req.body) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }
    if (!req.body.recipe_id || !req.body.meal_type_id) {
      return res.status(400).send({ errorMessage: 'Recipe or Meal_type id can not be empty!' });
    }
    try {
      const mealtypes = new MealTypeRecipes(req.body);
      const data = await MealTypeRecipes.create(mealtypes);
      res.status(201).send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating A mealtype.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await MealTypeRecipes.getAll())
        .map((m) => new MealTypeRecipes(m))
        .map((m) => ({
          id: m.id,
          recipe_id: m.recipe_id,
          meal_type_id: m.meal_type_id
        }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving mealtyperecipes.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await MealTypeRecipes.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `A mealtyperecipe with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving  mealtyperecipe with id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await MealTypeRecipes.updateById(
        req.params.id,
        new MealTypeRecipes(req.body)
      );
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `mealtyperecipes with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating mealtyperecipes with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await MealTypeRecipes.remove(req.params.id);
      res.send({ message: 'mealtyperecipes was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found mealtyperecipes with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete mealtyperecipes with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = MealTypeRecipesController;
