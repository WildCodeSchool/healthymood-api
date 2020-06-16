const Notification = require('../models/notification.model.js');

class NotificationsController {
  static async create (req, res) {
    if (!req.body) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }

    if (!req.body.title) {
      return res.status(400).send({ errorMessage: 'Title can not be empty!' });
    } else if (!req.body.content) {
      return res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const notification = new Notification(req.body);
      const data = await Notification.create(notification);
      res.status(201).send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the Notification.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await Notification.getAll())
        .map((n) => new Notification(n))
        .map((n) => ({
          title: n.title,
          content: n.content,
          link: n.link,
          dispatch_planning: n.dispatch_planning
        }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving notifications.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await Notification.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Notification with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving Notification with id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await Notification.updateById(
        req.params.id,
        new Notification(req.body)
      );
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Notification with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating Notification with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await Notification.remove(req.params.id);
      res.send({ message: 'Notification was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found Notification with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete Notification with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = NotificationsController;
