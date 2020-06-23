const User = require('../models/user.model.js');

class authController {
  static async login (req, res) {
    console.log('ok auth');
    const clientPayload = req.body;
    try {
      const { token } = await User.login(clientPayload.email, clientPayload.password);
      res.status(200).send({ token });
    } catch (err) {
      res.status(400).send({ message: 'invalid credentials' });
    }
  }
}

module.exports = authController;
