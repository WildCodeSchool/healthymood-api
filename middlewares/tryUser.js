const User = require('../models/user.model.js');

module.exports = async (req, res, next) => {
  const decodedToken = req.token;

  if (decodedToken) {
    const userRecord = await User.findById(decodedToken.id);
    req.currentUser = userRecord;
  }
  return next();
};
