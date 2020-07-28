
const User = require('../models/user.model.js');
const { tryParseInt } = require('../helpers/number');

class UsersController {
  static async create (req, res) {
    const clientPayload = req.body;

    const isNotEmptyString = (str) => {
      return typeof str === 'string' && str.length > 0;
    };

    if (
      !isNotEmptyString(clientPayload.username) ||
      !isNotEmptyString(clientPayload.email) ||
      !isNotEmptyString(clientPayload.password)
    ) {
      return res.status(422).send({ errorMessage: 'Missing attribute !' });
    }
    try {
      const { username, email, password } = clientPayload;
      const user = new User({ username, email, password });
      if (
        (await User.usernameAlreadyExists(user.username)) ||
        (await User.emailAlreadyExists(user.email))
      ) {
        res.status(400).send({
          errorMessage:
            'A user with this username or this email already exists !'
        });
      } else {
        const data = await User.create(user);
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the user.'
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
      const { results, total } = await User.getSome(limit, offset);
      res.header('content-range', `${rangeBegin}-${rangeEnd}/${total}`);
      res.send({ data: results, total: total });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        errorMessage: err.message
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await User.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `User with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving user with id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }
    try {
      const data = await User.updateById(req.params.id, new User(req.body));
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `User with id ${req.params.id} not found.`
        });
      } else {
        console.error(err);
        res.status(500).send({
          errorMessage: 'Error updating user with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await User.remove(req.params.id);
      res.send({ message: 'User was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found User with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete User with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = UsersController;
