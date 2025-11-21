const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory user store for tests (could be replaced by Mongo in future)
const users = [];

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }
  const existing = users.find(u => u.email === email);
  if (existing) return res.status(409).json({ error: 'Email already used' });
  const hashed = await bcrypt.hash(password, 8);
  const user = { id: String(Date.now()), username, email, password: hashed };
  users.push(user);
  return res.status(201).json({ id: user.id, username, email });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
  return res.json({ token });
});

module.exports = router;