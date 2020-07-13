const Article = require('../models/article.model.js');
const { tryParseInt } = require('../helpers/number');

class ArticlesController {
  static async create (req, res) {
    if (!req.body) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }

    if (!req.body.title) {
      return res.status(400).send({ errorMessage: 'Title can not be empty!' });
    } else if (!req.body.content) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const article = new Article(req.body);
      const data = await Article.create(article);
      res.status(201).send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the Article.'
      });
    }
  }

  static async findAll (req, res) {
    if (req.query.search) {
      try {
        const data = await Article.findByKeyWord(req.query.search);
        res.send({ data });
      } catch (err) {
        if (err.kind === 'not_found') {
          res.status(404).send({
            errorMessage: `Article with keyword ${req.query.search} not found.`
          });
        } else {
          res.status(500).send({
            errorMessage:
                'Error retrieving Article with keyword ' + req.query.search
          });
        }
      }
    }
    const page = tryParseInt(req.query.page, 1);
    const perPage = tryParseInt(req.query.per_page, 8);
    const orderBy = req.query.sort_by;
    const sortOrder = req.query.sort_order;
    const limit = perPage;
    const offset = (page - 1) * limit;
    const { results, total } = await Article.getSome(limit, offset, sortOrder, orderBy);
    const rangeEnd = page * perPage;
    const rangeBegin = rangeEnd - perPage + 1;
    res.header('content-range', `${rangeBegin}-${rangeEnd}/${total}`);
    res.send({ data: results });
  }

  static async findOne (req, res) {
    try {
      const data = await Article.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Article with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving Article with id ' + req.params.id
        });
      }
    }
  }

  static async findLast (req, res) {
    try {
      const data = (await Article.getLastArticles())
        .map((a) => new Article(a))
        .map((a) => ({
          id: a.id,
          title: a.title,
          content: a.content,
          image: a.image,
          created_at: a.created_at,
          updated_at: a.updated_at,
          slug: a.slug,
          article_category_id: a.article_category_id,
          user_id: a.user_id
        }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving article.'
      });
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await Article.updateById(req.params.id, new Article(req.body));
      res.send({ data });
    } catch (err) {
      console.log(err);
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Article with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating Article with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await Article.remove(req.params.id);
      res.send({ message: 'Article was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found Article with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete Article with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = ArticlesController;
