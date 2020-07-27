const ArticleCategory = require('../models/article-categories.model.js');
const { tryParseInt } = require('../helpers/number');

class ArticlesCategoryController {
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
      const articleCategory = new ArticleCategory(req.body);
      if (await ArticleCategory.nameAlreadyExists(articleCategory.name)) {
        res.status(400).send({
          errorMessage: 'A ArticleCategory with this name already exists !'
        });
      } else {
        const data = await ArticleCategory.create(articleCategory);
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the ArticleCategory.'
      });
    }
  }

  static async findAll (req, res) {
    const data = await ArticleCategory.getAll();
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
    const { results, total } = await ArticleCategory.getSome(shouldPaginate ? limit : undefined, shouldPaginate ? offset : undefined);
    res.header('content-range', `${rangeBegin}-${rangeEnd}/${total}`);
    res.send({ data: results, total: total });
  }

  static async findOne (req, res) {
    try {
      const data = await ArticleCategory.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `ArticleCategory with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving ArticleCategory with id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await ArticleCategory.updateById(
        req.params.id,
        new ArticleCategory(req.body)
      );
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `ArticleCategory with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating ArticleCategory with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await ArticleCategory.remove(req.params.id);
      res.send({ message: 'ArticleCategory was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found ArticleCategory with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete ArticleCategory with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = ArticlesCategoryController;
