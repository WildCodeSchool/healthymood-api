const ArticleCategory = require('../models/article-categories.model.js');

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
    try {
      const data = (await ArticleCategory.getAll())
        .map((a) => new ArticleCategory(a))
        .map((a) => ({
          id: a.id,
          name: a.name
        }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving ArticleCategory.'
      });
    }
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
          errorMessage: 'Error updating ArticleCategory okkk with id ' + req.params.id
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
