const Ingredient = require('../models/ingredient.model.js');
const { tryParseInt } = require('../helpers/number');

class IngredientsController {
  static async create (req, res) {
    if (!req.body) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }

    if (!req.body.name) {
      return res.status(400).send({ errorMessage: 'Name can not be empty!' });
    }

    try {
      const ingredient = new Ingredient(req.body);
      if (await Ingredient.nameAlreadyExists(ingredient.name)) {
        res.status(400).send({
          errorMessage: 'An ingredient with this name already exists !'
        });
      } else {
        const data = await Ingredient.create(ingredient);
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the Ingredient.'
      });
    }
  }

  static async findSome (req, res) {
    const shouldPaginate = req.query.page && req.query.per_page;
    const page = tryParseInt(req.query.page, 1);
    const perPage = tryParseInt(req.query.per_page, 10);
    const filterIngredientByAllergen = req.query.is_allergen;
    const orderBy = req.query.sort_by;
    const sortOrder = req.query.sort_order;
    const limit = perPage;
    const offset = (page - 1) * limit;
    const rangeEnd = page * perPage;
    const rangeBegin = rangeEnd - perPage + 1;
    const { results, total } = await Ingredient.getSome(shouldPaginate ? limit : undefined, shouldPaginate ? offset : undefined, sortOrder, orderBy, filterIngredientByAllergen);
    res.header('content-range', `${rangeBegin}-${rangeEnd}/${total}`);
    res.send({ data: results, total: total });
  }

  static async findAll (req, res) {
    const data = await Ingredient.getAll();
    res.send({ data });
  }

  static async findOne (req, res) {
    try {
      const data = await Ingredient.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Ingredient with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving Ingredient with id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await Ingredient.updateById(
        req.params.id,
        new Ingredient(req.body)
      );
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Ingredient with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating Ingredient with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await Ingredient.remove(req.params.id);
      res.send({ message: 'Ingredient was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found Ingredient with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete Ingredient with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = IngredientsController;
