// posts.test.js - Integration tests for posts API endpoints

const request = require('supertest');
const mongoose = require('mongoose');
const { generateToken } = require('../../src/utils/auth');

// Mock Mongoose models before requiring app so routes use mocks
const users = [];
const posts = [];

jest.mock('../../src/models/User', () => {
  return function User(data) {
    Object.assign(this, data);
    this._id = this._id || new (require('mongoose')).Types.ObjectId();
  };
});

jest.mock('../../src/models/Post', () => {
  const mongoose = require('mongoose');
  class PostMock {
    constructor(data) {
      Object.assign(this, data);
      this._id = this._id || new mongoose.Types.ObjectId();
    }
    async save() {
      const existing = posts.find(p => p._id.toString() === this._id.toString());
      if (!existing) posts.push(this);
      return this;
    }
    async remove() {
      const idx = posts.findIndex(p => p._id.toString() === this._id.toString());
      if (idx >= 0) posts.splice(idx, 1);
    }
    static async create(data) {
      const p = new PostMock(data);
      posts.push(p);
      return p;
    }
    static find(filter = {}) {
      let result = posts.slice();
      if (filter.category) {
        result = result.filter(p => p.category && p.category.toString() === filter.category);
      }
      // Chainable query stub
      return new Query(result);
    }
    static async findById(id) {
      return posts.find(p => p._id.toString() === id.toString()) || null;
    }
    static async insertMany(arr) {
      arr.forEach(d => posts.push(new PostMock(d)));
    }
  }
  class Query {
    constructor(data) {
      this.data = data;
    }
    skip(n) {
      this.data = this.data.slice(n);
      return this;
    }
    limit(n) {
      this.data = this.data.slice(0, n);
      return Promise.resolve(this.data);
    }
  }
  return PostMock;
});

const User = require('../../src/models/User');
const Post = require('../../src/models/Post');
const app = require('../../src/app');

let token;
let userId;
let postId;

beforeAll(async () => {
  // Create test user
  const user = new User({ username: 'testuser', email: 'test@example.com', password: 'password123' });
  users.push(user);
  userId = user._id;
  token = generateToken(user);
  // Create initial post
  const post = await Post.create({
    title: 'Test Post',
    content: 'This is a test post content',
    author: userId,
    category: new mongoose.Types.ObjectId(),
    slug: 'test-post',
  });
  postId = post._id;
});

afterEach(() => {
  // No-op: keep data for tests unless explicitly modified
});

afterAll(() => {
  users.length = 0;
  posts.length = 0;
});

describe('POST /api/posts', () => {
  it('should create a new post when authenticated', async () => {
    const newPost = {
      title: 'New Test Post',
      content: 'This is a new test post content',
      category: new mongoose.Types.ObjectId().toString(),
    };

    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(newPost.title);
    expect(res.body.content).toBe(newPost.content);
    expect(res.body.author).toBe(userId.toString());
  });

  it('should return 401 if not authenticated', async () => {
    const newPost = {
      title: 'Unauthorized Post',
      content: 'This should not be created',
      category: new mongoose.Types.ObjectId().toString(),
    };

    const res = await request(app)
      .post('/api/posts')
      .send(newPost);

    expect(res.status).toBe(401);
  });

  it('should return 400 if validation fails', async () => {
    const invalidPost = {
      content: 'This post is missing a title',
      category: new mongoose.Types.ObjectId().toString(),
    };

    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidPost);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/posts', () => {
  it('should return all posts', async () => {
    const res = await request(app).get('/api/posts');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should filter posts by category', async () => {
    const categoryId = new mongoose.Types.ObjectId().toString();
    
    // Create a post with specific category
    await Post.create({
      title: 'Filtered Post',
      content: 'This post should be filtered by category',
      author: userId,
      category: categoryId,
      slug: 'filtered-post',
    });

    const res = await request(app)
      .get(`/api/posts?category=${categoryId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].category).toBe(categoryId);
  });

  it('should paginate results', async () => {
    // Create multiple posts
    const morePosts = [];
    for (let i = 0; i < 15; i++) {
      morePosts.push({
        title: `Pagination Post ${i}`,
        content: `Content for pagination test ${i}`,
        author: userId,
        category: new mongoose.Types.ObjectId(),
        slug: `pagination-post-${i}`,
      });
    }
    await Post.insertMany(morePosts);

    const page1 = await request(app)
      .get('/api/posts?page=1&limit=10');
    
    const page2 = await request(app)
      .get('/api/posts?page=2&limit=10');

    expect(page1.status).toBe(200);
    expect(page2.status).toBe(200);
    expect(page1.body.length).toBe(10);
    expect(page2.body.length).toBeGreaterThan(0);
    expect(page1.body[0]._id).not.toBe(page2.body[0]._id);
  });
});

describe('GET /api/posts/:id', () => {
  it('should return a post by ID', async () => {
    const res = await request(app)
      .get(`/api/posts/${postId}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(postId.toString());
    expect(res.body.title).toBe('Test Post');
  });

  it('should return 404 for non-existent post', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/posts/${nonExistentId}`);

    expect(res.status).toBe(404);
  });
});

describe('PUT /api/posts/:id', () => {
  it('should update a post when authenticated as author', async () => {
    const updates = {
      title: 'Updated Test Post',
      content: 'This content has been updated',
    };

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updates);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updates.title);
    expect(res.body.content).toBe(updates.content);
  });

  it('should return 401 if not authenticated', async () => {
    const updates = {
      title: 'Unauthorized Update',
    };

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .send(updates);

    expect(res.status).toBe(401);
  });

  it('should return 403 if not the author', async () => {
    // Create another user
    const anotherUser = new User({
      username: 'anotheruser',
      email: 'another@example.com',
      password: 'password123',
    });
    users.push(anotherUser);
    const anotherToken = generateToken(anotherUser);

    const updates = {
      title: 'Forbidden Update',
    };

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${anotherToken}`)
      .send(updates);

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/posts/:id', () => {
  it('should delete a post when authenticated as author', async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    
    // Verify post is deleted
    const deletedPost = await Post.findById(postId);
    expect(deletedPost).toBeNull();
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`);

    expect(res.status).toBe(401);
  });
}); 