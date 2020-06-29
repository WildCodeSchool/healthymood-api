const DishTypes = require('../models/dish_types.model.js');

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
          errorMessage: 'A dish type with this name already exists !'
        });
      } else {
        const data = await DishTypes.create(dishtypes);
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating A dish type.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await DishTypes.getAll())
        .map((m) => new DishTypes(m))
        .map((m) => ({
          id: m.id,
          name: m.name
        }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving A dish type.'
      });
    }
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
