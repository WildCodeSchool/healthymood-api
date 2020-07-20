const Mailer = require('../mailer.js');

class formController {
  static async create (req, res) {
    const sendRecipePayload = req.body;
    if (!sendRecipePayload) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      await Mailer.sendMail(sendRecipePayload);
      res.status(201).send(sendRecipePayload);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the mail.'
      });
    }
  }
}

module.exports = formController;
