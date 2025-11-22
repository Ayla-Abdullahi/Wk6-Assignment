const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('express').json;
const Post = require('./models/Post');
const User = require('./models/User');
const crypto = require('crypto');
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

// In-memory fallback for E2E when no Mongo connection desired
const useMemory = process.env.USE_INMEMORY_DB === '1';
const postsStore = [];

// Visual regression demo route (serves a simple Button component page)
app.get('/visual/button', (_req, res) => {
  res.type('html').send(`<!DOCTYPE html><html><head><title>Button Visual</title></head><body>
    <button class="btn" data-variant="primary">Primary</button>
    <button class="btn" data-variant="secondary">Secondary</button>
    <style>.btn{padding:8px 12px;margin:4px;font-family:sans-serif;border:1px solid #333;cursor:pointer}</style>
  </body></html>`);
});
app.post('/api/posts', authMiddleware, async (req, res) => {
  const { title, content, category } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  if (useMemory) {
    const post = { _id: crypto.randomUUID(), title, content, category, author: req.user.id, slug: title.toLowerCase().replace(/\s+/g, '-') };
    postsStore.push(post);
    return res.status(201).json(post);
  }
  try {
    const post = await Post.create({ title, content, category, author: req.user.id, slug: title.toLowerCase().replace(/\s+/g, '-') });
    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/posts', async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const filterMatch = p => !category || p.category === category;
  if (useMemory) {
    const start = (Number(page) - 1) * Number(limit);
    const slice = postsStore.filter(filterMatch).slice(start, start + Number(limit));
    return res.json(slice);
  }
  const filter = {};
  if (category) filter.category = category;
  const skip = (Number(page) - 1) * Number(limit);
  const posts = await Post.find(filter).skip(skip).limit(Number(limit));
  return res.json(posts);
});

app.get('/api/posts/:id', async (req, res) => {
  if (useMemory) {
    const post = postsStore.find(p => p._id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.json(post);
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.json(post);
  } catch (err) {
    return res.status(404).json({ error: 'Not found' });
  }
});

app.put('/api/posts/:id', authMiddleware, async (req, res) => {
  if (useMemory) {
    const post = postsStore.find(p => p._id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    Object.assign(post, req.body);
    return res.json(post);
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    Object.assign(post, req.body);
    await post.save();
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  if (useMemory) {
    const idx = postsStore.findIndex(p => p._id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    if (postsStore[idx].author !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    postsStore.splice(idx, 1);
    return res.json({ success: true });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await post.remove();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Global error handler should be last
app.use(errorHandler);

module.exports = app;
