const Favorite = require('../models/favorite.model.js');

class FavoritesController {
  static async create (req, res) {
    if (!req.body) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }

    if (!req.body.recipe_id || !req.currentUser.id) {
      return res.status(400).send({ errorMessage: 'One attribute is missing' });
    }
    const user_id = req.currentUser.id; // eslint-disable-line
    const recipe_id = req.body.recipe_id; // eslint-disable-line
    let data = null;
    try {
      const existingFavorite = await Favorite.find(user_id, recipe_id);
      if (existingFavorite) {
        data = await Favorite.remove(existingFavorite.id);
      } else {
        data = await Favorite.create({
          recipe_id,
          user_id
        });
      }
      res.status(201).send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the Favorite.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await Favorite.getAll(req.currentUser.id))
        .map((n) => new Favorite(n))
        .map((n) => ({
          id: n.id,
          user_id: n.user_id,
          recipe_id: n.recipe_id
        }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving favorite.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await Favorite.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `favorite with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving favorite with id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await Favorite.updateById(
        req.params.id,
        new Favorite(req.body)
      );
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `favorite with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating favorite with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await Favorite.remove(req.params.id);
      res.send({ message: 'favorite was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found favorite with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete favorite with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = FavoritesController;
