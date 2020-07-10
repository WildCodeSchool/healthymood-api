const User = require('../models/user.model.js');

module.exports = async (req, res, next) => {
  const decodedToken = req.token;

  if (!decodedToken) {
    return res.sendStatus(401);
  } else {
    const userRecord = await User.findById(decodedToken.id);
    req.currentUser = userRecord;
    if (!userRecord) {
      return res.sendStatus(401);
    } else if (userRecord.blocked) {
      return res
        .status(403)
        .send({ errorMessage: 'This account is Blocked !' });
    } else {
      return next();
    }
  }
};
