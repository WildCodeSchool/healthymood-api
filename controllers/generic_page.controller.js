const GenericPage = require('../models/generic_pages.model.js');

class GenericPagesController {
  static async create (req, res) {
    if (!req.body) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }

    if (!req.body.slug) {
      return res.status(400).send({ errorMessage: 'slug can not be empty!' });
    }

    try {
      const genericPage = new GenericPage(req.body);
      if (await GenericPage.nameAlreadyExists(genericPage.slug)) {
        res.status(400).send({
          errorMessage: 'An genericPage with this slug already exists !'
        });
      } else {
        const data = await GenericPage.create(genericPage);
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the genericPage.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await GenericPage.getAll())
        .map((i) => new GenericPage(i))
        .map((i) => ({
          id: i.id,
          title: i.title,
          slug: i.slug,
          published: i.published,
          content: i.content,
          user_id: i.user_id
        }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving genericPage.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await GenericPage.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `genericPage with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving genericPage with id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await GenericPage.updateById(
        req.params.id,
        new GenericPage(req.body)
      );
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `GenericPage with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating genericPage with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await GenericPage.remove(req.params.id);
      res.send({ message: 'GenericPage was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found genericPage with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete genericPage with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = GenericPagesController;
