const User = require('../models/user.model.js');

class authController {
  static async login (req, res) {
    const clientPayload = req.body;

    try {
      const user = await User.findByEmail(clientPayload.email);
      if (user.blocked) {
        return res.status(403).send({ errorMessage: 'This user is blocked' });
      }
      const { token } = await User.login(
        clientPayload.email,
        clientPayload.password
      );
      res.status(200).send({ token });
    } catch (err) {
      res.status(400).send({ message: 'invalid credentials' });
    }
  }
}

module.exports = authController;
