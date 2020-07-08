const User = require('../../models/user.model');

module.exports = async (is_admin = true, blocked = false) => {
  const user = await User.create({
    username: 'ana2',
    email: 'ana@gmail.co',
    password: 'ifanrivgn',
    is_admin,
    blocked
  });
  const { token } = await User.login('ana@gmail.co', 'ifanrivgn');

  return { token, user };
};
