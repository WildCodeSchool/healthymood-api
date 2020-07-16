const Article = require("../models/article.model.js");
const { tryParseInt } = require("../helpers/number");

class ArticlesController {
  static async create(req, res) {
    if (!req.body) {
      return res
        .status(400)
        .send({ errorMessage: "Content can not be empty!" });
    }

    if (!req.body.slug) {
      return res.status(400).send({ errorMessage: "Slug can not be empty!" });
    } else if (!req.body.content) {
      return res
        .status(400)
        .send({ errorMessage: "Content can not be empty!" });
    }

    const user_id = req.currentUser.id; // eslint-disable-line

    try {
      const article = new Article({ ...req.body, user_id: user_id });

      if (await Article.nameAlreadyExists(article.slug)) {
        res.status(400).send({
          errorMessage: "An article with this slug already exists !",
        });
      } else {
        const fullUrl = req.protocol + "://" + req.get("host");
        const imageRelativeUrl = req.body.image.replace(fullUrl, "");
        article.image = imageRelativeUrl;
        const data = await Article.create(article);
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || "Some error occurred while creating the Article.",
      });
    }
  }

  static async findAll(req, res) {
    const fullUrl = req.protocol + "://" + req.get("host");

    try {
      const page = tryParseInt(req.query.page, 1);
      const perPage = tryParseInt(req.query.per_page, 10);
      const orderBy = req.query.sort_by;
      const sortOrder = req.query.sort_order;
      const limit = perPage;
      const offset = (page - 1) * limit;
      const { results, total } = await Article.getSome(
        limit,
        offset,
        sortOrder,
        orderBy,
        req.query.search
      );
      const rangeEnd = page * perPage;
      const rangeBegin = rangeEnd - perPage + 1;
      res.header("content-range", `${rangeBegin}-${rangeEnd}/${total}`);
      res.send({
        data: results.map((a) => ({
          ...a,
          image: a.image ? fullUrl + a.image : null,
        })),
      });
    } catch (err) {
      console.error(err)
      res.status(500).send({
        errorMessage:
          "Error retrieving Article with keyword " + req.query.search,
        });
    }
  }

  static async findOne(req, res) {
    const fullUrl = req.protocol + "://" + req.get("host");
    console.log(fullUrl);
    try {
      const data = await Article.findById(req.params.id);

      let author = null;

      try {
        author = await Article.getArticleAuthor(data.user_id);
      } catch (err) {
        console.error(err);
      }

      res.send({ data: { ...data, author, image: fullUrl + data.image } });
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          errorMessage: `Article with id ${req.params.id} not found.`,
        });
      } else {
        res.status(500).send({
          errorMessage: "Error retrieving Article with id " + req.params.id,
        });
      }
    }
  }

  static async findLast(req, res) {
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
          user_id: a.user_id,
          intro: a.intro,
        }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || "Some error occurred while retrieving article.",
      });
    }
  }

  static async update(req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: "Content can not be empty!" });
    }

    try {
      const article = new Article(req.body);
      const fullUrl = req.protocol + "://" + req.get("host");
      const imageRelativeUrl = req.body.image.replace(fullUrl, "");
      article.image = imageRelativeUrl;
      const data = await Article.updateById(req.params.id, article);
      res.send({ data });
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          errorMessage: `Article with id ${req.params.id} not found.`,
        });
      } else {
        res.status(500).send({
          errorMessage: "Error updating Article with id " + req.params.id,
        });
      }
    }
  }

  static async delete(req, res) {
    try {
      await Article.remove(req.params.id);
      res.send({ message: "Article was deleted successfully!" });
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          errorMessage: `Not found Article with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          errorMessage: "Could not delete Article with id " + req.params.id,
        });
      }
    }
  }

  static async upload(req, res) {
    const fullUrl = req.protocol + "://" + req.get("host");
    try {
      const picture = req.file ? req.file.path.replace("\\", "/") : null;
      res.status(200).send(fullUrl + "/" + picture);
    } catch (err) {
      console.log(err);
      console.error(err);
      res.status(500).send(err);
    }
  }
}

module.exports = ArticlesController;
