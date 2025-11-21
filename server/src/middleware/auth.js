// Very small auth middleware that reads a Bearer token and attaches user info.
// For tests we accept any token that looks like a string representing a user id JSON.
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const auth = req.header('Authorization');
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Unauthorized' });
  const token = parts[1];
  try {
    // For tests we allow token to be a signed JWT from utils/generateToken
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'testsecret');
    req.user = { id: payload.id };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
