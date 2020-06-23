class secretController {
  static async show (req, res) {
    res.send({ secret: 42 });
  }
}

module.exports = secretController;
