const RecipeCategory = require('../models/recipe-categories.model.js');

class RecipesCategoryController {
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
      const recipeCategory = new RecipeCategory(req.body);
      if (await RecipeCategory.nameAlreadyExists(recipeCategory.name)) {
        res.status(400).send({
          errorMessage: 'A RecipeCategory with this name already exists !'
        });
      } else {
        const fullUrl = req.protocol + '://' + req.get('host');
        const imageRelativeUrl = req.body.image.replace(fullUrl, '');
        recipeCategory.image = imageRelativeUrl;
        const data = await RecipeCategory.create(recipeCategory);
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the RecipeCategory.'
      });
    }
  }

  static async findAll (req, res) {
    const fullUrl = req.protocol + '://' + req.get('host');
    try {
      const data = (await RecipeCategory.getAll())
        .map((i) => new RecipeCategory(i))
        .map((i) => ({
          id: i.id,
          name: i.name,
          image: i.image
        }));
      res.send({ data: data.map(rc => ({ ...rc, image: rc.image ? (fullUrl + rc.image) : null })) });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving RecipeCategory.'
      });
    }
  }

  static async findOne (req, res) {
    const fullUrl = req.protocol + '://' + req.get('host');
    try {
      const data = await RecipeCategory.findById(req.params.id);
      res.send({ data: { ...data, image: fullUrl + data.image } });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `RecipeCategory with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving RecipeCategory with id ' + req.params.id
        });
      }
    }
  }

  static async findAllRecipes (req, res) {
    try {
      const data = await RecipeCategory.getAllRecipes(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Recipes with category id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving Recipes with category id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const recipeCategorie = new RecipeCategory(req.body);
      const fullUrl = req.protocol + '://' + req.get('host');
      const imageRelativeUrl = req.body.image.replace(fullUrl, '');
      recipeCategorie.image = imageRelativeUrl;
      const data = await RecipeCategory.updateById(req.params.id, recipeCategorie);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `RecipeCategory with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating RecipeCategory with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await RecipeCategory.remove(req.params.id);
      res.send({ message: 'RecipeCategory was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found RecipeCategory with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete RecipeCategory with id ' + req.params.id
        });
      }
    }
  }

  static async upload (req, res) {
    const fullUrl = req.protocol + '://' + req.get('host');
    try {
      const picture = req.file ? req.file.path.replace('\\', '/') : null;
      res.status(200).send(fullUrl + '/' + picture);
    } catch (err) {
      console.log(err);
      console.error(err);
      res.status(500).send(err);
    }
  }
}

module.exports = RecipesCategoryController;
