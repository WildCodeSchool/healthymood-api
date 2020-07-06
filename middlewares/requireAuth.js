const User = require('../models/user.model.js');

module.exports = async (req, res, next) => {
  const decodedToken = req.token;
  console.log(decodedToken);

  if (!decodedToken) {
    return res.sendStatus(401);
  } else {
    const userRecord = await User.findById(decodedToken.id);
    req.currentUser = userRecord;
    console.log(req.currentUser);
    if (!userRecord) {
      return res.sendStatus(401);
    } else {
      return next();
    }
  }
};
