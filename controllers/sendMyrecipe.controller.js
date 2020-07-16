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
      const mail = await Mailer.sendMail(sendRecipePayload);
      if (mail) {
        res.status(201).send(sendRecipePayload);
        console.log(req.body);
      }
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the mail.'
      });
    }
  }
}

module.exports = formController;
