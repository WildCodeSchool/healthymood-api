const MealTypes = require('../models/meal_types.model.js');
const { tryParseInt } = require('../helpers/number');

class MealTypesController {
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
      const mealtypes = new MealTypes(req.body);
      if (await MealTypes.nameAlreadyExists(mealtypes.name)) {
        res.status(400).send({
          errorMessage: 'A mealtype with this name already exists !'
        });
      } else {
        const data = await MealTypes.create(mealtypes);
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating A mealtype.'
      });
    }
  }

  static async findAll (req, res) {
    const data = await MealTypes.getAll();
    res.send({ data });
  }

  static async findSome (req, res) {
    const shouldPaginate = req.query.page && req.query.per_page;
    const page = tryParseInt(req.query.page, 1);
    const perPage = tryParseInt(req.query.per_page, 8);
    const limit = perPage;
    const offset = (page - 1) * limit;
    const rangeEnd = page * perPage;
    const rangeBegin = rangeEnd - perPage + 1;
    const { results, total } = await MealTypes.getSome(shouldPaginate ? limit : undefined, shouldPaginate ? offset : undefined);
    res.header('content-range', `${rangeBegin}-${rangeEnd}/${total}`);
    res.send({ data: results, total: total });
  }

  static async findOne (req, res) {
    try {
      const data = await MealTypes.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `A mealtype with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving  mealtype with id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await MealTypes.updateById(
        req.params.id,
        new MealTypes(req.body)
      );
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `mealtypes with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating mealtype with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await MealTypes.remove(req.params.id);
      res.send({ message: 'mealtypes was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found mealtype with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete mealtype with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = MealTypesController;
