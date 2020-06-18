const Addresse = require('../models/addresse.model.js');

class AddressesController {
  static async create (req, res) {
    if (!req.body) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }

    if (!req.body.street || !req.body.city || !req.body.zipcode || !req.body.country) {
      return res.status(400).send({ errorMessage: 'street, city, zipcode & country can not be empty!' });
    }

    try {
      const addresse = new Addresse(req.body);
      const data = await Addresse.create(addresse);
      res.status(201).send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the Addresse.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await Addresse.getAll())
        .map((a) => new Addresse(a))
        .map((a) => ({
          id: a.id,
          street: a.street,
          zipcode: a.zipcode,
          city: a.city,
          country: a.country
        }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving Addresse.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await Addresse.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Addresse with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving Addresse with id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await Addresse.updateById(
        req.params.id,
        new Addresse(req.body)
      );
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Addresse with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating Addresse with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await Addresse.remove(req.params.id);
      res.send({ message: 'Addresse was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found Addresse with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete Addresse with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = AddressesController;
