const DishTypes = require('../models/dish_types.model.js');
const { tryParseInt } = require('../helpers/number');

class DishTypesController {
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
      const dishtypes = new DishTypes(req.body);
      if (await DishTypes.nameAlreadyExists(dishtypes.name)) {
        res.status(400).send({
          errorMessage: 'A dishtype with this name already exists !'
        });
      } else {
        const data = await DishTypes.create(dishtypes);
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating A dishtype.'
      });
    }
  }

  static async findAll (req, res) {
    const data = await DishTypes.getAll();
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
    const { results, total } = await DishTypes.getSome(shouldPaginate ? limit : undefined, shouldPaginate ? offset : undefined);
    res.header('content-range', `${rangeBegin}-${rangeEnd}/${total}`);
    res.send({ data: results, total: total });
  }

  static async findOne (req, res) {
    try {
      const data = await DishTypes.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `A dishtype with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving  dishtype with id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await DishTypes.updateById(
        req.params.id,
        new DishTypes(req.body)
      );
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `dishtypes with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating dishtype with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await DishTypes.remove(req.params.id);
      res.send({ message: 'dishtypes was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found dishtype with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete dishtype with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = DishTypesController;
