const Mailer = require('../mailer.js');

class formController {
  static async create (req, res) {
    console.log(req.body);
    if (!req.body) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const mail = await Mailer.sendMail(req.body);
      if (mail) {
        res.status(201).send(req.body);
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
