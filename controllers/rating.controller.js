const Rating = require('../models/rating.model.js');

class RatingsController {
  static async create (req, res) {
    console.log(req.currentUser);
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
      // const user_id = req.currentUser.id;
      const rating = new Rating(req.body);
      const data = await Rating.create(rating);
      res.status(201).send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the Rating.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await Rating.getAll())
        .map((n) => new Rating(n))
        .map((n) => ({
          id: n.id,
          score: n.score,
          user_id: n.user_id,
          recipe_id: n.recipe_id
        }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving rating.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await Rating.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Rating with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving Rating with id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await Rating.updateById(req.params.id, new Rating(req.body));
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Rating with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating Rating with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await Rating.remove(req.params.id);
      res.send({ message: 'Rating was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found Rating with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete Rating with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = RatingsController;
