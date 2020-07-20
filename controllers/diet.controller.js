const DietTypes = require('../models/diet.model.js');
const { tryParseInt } = require('../helpers/number');

class DietTypesController {
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
      const diettypes = new DietTypes(req.body);
      if (await DietTypes.nameAlreadyExists(diettypes.name)) {
        res.status(400).send({
          errorMessage: 'A diettype with this name already exists !'
        });
      } else {
        const data = await DietTypes.create(diettypes);
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating A diettype.'
      });
    }
  }

  static async findAll (req, res) {
    const data = await DietTypes.getAll();
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
    const { results, total } = await DietTypes.getSome(shouldPaginate ? limit : undefined, shouldPaginate ? offset : undefined);
    res.header('content-range', `${rangeBegin}-${rangeEnd}/${total}`);
    res.send({ data: results, total: total });
  }

  static async findOne (req, res) {
    try {
      const data = await DietTypes.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `A diettype with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving  diettype with id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await DietTypes.updateById(
        req.params.id,
        new DietTypes(req.body)
      );
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `diettypes with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating diettype with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await DietTypes.remove(req.params.id);
      res.send({ message: 'diettypes was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found diettype with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete diettype with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = DietTypesController;
