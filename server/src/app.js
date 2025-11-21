const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('express').json;
const Post = require('./models/Post');
const User = require('./models/User');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const { logInfo } = require('./utils/logger');
// Auth routes (in-memory) will be mounted after middleware
const authRoutes = require('./routes/auth');

const app = express();
app.use(bodyParser());

// Simple request logging for debugging
app.use((req, _res, next) => {
  logInfo('request', { method: req.method, path: req.path });
  next();
});

// Mount auth routes
app.use('/api/auth', authRoutes);

// Simple posts routes used by tests
// Visual regression demo route (serves a simple Button component page)
app.get('/visual/button', (_req, res) => {
  res.type('html').send(`<!DOCTYPE html><html><head><title>Button Visual</title></head><body>
    <button class="btn" data-variant="primary">Primary</button>
    <button class="btn" data-variant="secondary">Secondary</button>
    <style>.btn{padding:8px 12px;margin:4px;font-family:sans-serif;border:1px solid #333;cursor:pointer}</style>
  </body></html>`);
});
app.post('/api/posts', authMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const post = await Post.create({ title, content, category, author: req.user.id, slug: title.toLowerCase().replace(/\s+/g, '-') });
    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/posts', async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  const skip = (Number(page) - 1) * Number(limit);
  const posts = await Post.find(filter).skip(skip).limit(Number(limit));
  res.json(posts);
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

app.put('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await post.remove();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Global error handler should be last
app.use(errorHandler);

module.exports = app;
