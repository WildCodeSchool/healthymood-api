const User = require('../models/user.model.js');
const authenticateHelper = async ({ blocked, isAdmin }) => {
  await User.create({
    username: 'john doe',
    email: 'john.doe@gmail.com',
    password: 'admin123',
    blocked: blocked,
    is_admin: isAdmin
  });
  const token = (await User.login('john.doe@gmail.com', 'admin123')).token;
  return token;
};

module.exports = {
  authenticateHelper
};
