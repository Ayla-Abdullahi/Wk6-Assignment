const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = { id: user._id ? user._id.toString() : user.id };
  return jwt.sign(payload, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
}

module.exports = { generateToken };
