const User = require('../models/user.model.js');

class UsersController {
  static async create(req, res) {
    const clientPayload = req.body;

    const isNotEmptyString = (str) => {
      return typeof str === 'string' && str.length > 0;
    };

    if (!isNotEmptyString(clientPayload.username) || !isNotEmptyString(clientPayload.email) || !isNotEmptyString(clientPayload.password)) {
      return res.status(422).send({ errorMessage: 'Missing attribute !' });
    }
    try {
      const user = new User(clientPayload);
      if (await User.usernameAlreadyExists(user.username) || await User.emailAlreadyExists(user.email)) {
        res.status(400).send({
          errorMessage: 'A user with this username or this email already exists !'
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

  static async findAll(req, res) {
    try {
      const data = (await User.getAll())
        .map((u) => new User(u))
        .map((u) => ({
          id: u.id,
          firstname: u.firstname,
          lastname: u.lastname,
          username: u.username,
          email: u.email,
          password: 'secret',
          fb_uid: u.fb_uid,
          avatar: u.avatar,
          is_admin: u.is_admin,
          blocked: u.blocked,
          address_id: u.address_id
        }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving users.'
      });
    }
  }

  static async findOne(req, res) {
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

  static async update(req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }
    try {
      const { is_admin, blocked } = req.body;// eslint-disable-lint
      const data = await User.updateById(
        req.params.id, { is_admin, blocked }
      );
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

  static async delete(req, res) {
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
