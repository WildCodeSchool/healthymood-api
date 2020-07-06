const User = require('../models/user.model.js');

module.exports = async (req, res, next) => {
  const decodedToken = req.token;

  if (!decodedToken) {
    return res.sendStatus(401);
  } else {
    const userRecord = await User.findById(decodedToken.id);
    req.currentUser = userRecord;
    if (!userRecord.is_admin) {
      return res
        .status(403)
        .send({ errorMessage: 'This user is not an Admin' });
    } else {
      return next();
    }
  }
};
