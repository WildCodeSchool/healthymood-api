const GenericPage = require('../models/generic_pages.model.js');
const { tryParseInt } = require('../helpers/number');

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
    const user_id = req.currentUser.id; // eslint-disable-line
    try {
      const genericPage = new GenericPage({ ...req.body, user_id: user_id });
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
      const page = tryParseInt(req.query.page, 1);
      const perPage = tryParseInt(req.query.per_page, 8);
      const limit = perPage;
      const offset = (page - 1) * limit;
      const rangeEnd = page * perPage;
      const rangeBegin = rangeEnd - perPage + 1;
      const { results, total } = await GenericPage.getSome(limit, offset);
      res.header('content-range', `${rangeBegin}-${rangeEnd}/${total}`);
      res.send({ data: results, total: total });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving genericPage.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      let data;
      const notPublished = {
        title: "Il n'y a rien ici :-(",
        content:
          '<h3 style="width: 100%; text-align: center;">Cette page est sûrement en cours de construction ...</h3>'
      };
      if (isNaN(parseInt(req.params.id))) {
        data = await GenericPage.findBySlug(req.params.id);
        (!data.published && !req.currentUser && (data = notPublished)) ||
        (!data.published && !req.currentUser.is_admin && (data = notPublished));
        res.send({ data });
      } else {
        data = await GenericPage.findById(req.params.id);
        res.send({ data });
      }
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
    const user_id = req.currentUser.id; // eslint-disable-line
    try {
      const data = await GenericPage.updateById(
        req.params.id,
        new GenericPage({ ...req.body, user_id: user_id })
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
