const Ingredient = require('../models/ingredient.model.js');

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
    console.log(req.body);

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

  static async findAll (req, res) {
    try {
      const data = (await Ingredient.getAll())
        .map((i) => new Ingredient(i))
        .map((i) => ({
          id: i.id,
          name: i.name,
          is_allergen: i.is_allergen
        }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving ingredients.'
      });
    }
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
