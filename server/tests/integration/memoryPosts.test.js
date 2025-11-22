const request = require('supertest');

// Enable in-memory mode before requiring app
process.env.USE_INMEMORY_DB = '1';
const app = require('../../src/app');

async function registerAndLogin(email = `user${Date.now()}@test.dev`) {
  const username = email.split('@')[0];
  await request(app).post('/api/auth/register').send({ username, email, password: 'pass123' });
  const loginRes = await request(app).post('/api/auth/login').send({ email, password: 'pass123' });
  return loginRes.body.token;
}

describe('In-memory posts store branches', () => {
  let tokenA;
  let tokenB;
  beforeAll(async () => {
    tokenA = await registerAndLogin('alpha@test.dev');
    tokenB = await registerAndLogin('beta@test.dev');
  });

  test('POST /api/posts rejects missing title (400)', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ content: 'No title here' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Title/);
  });

  let createdPost;
  test('POST /api/posts creates post (201)', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'First Post', content: 'Memory mode', category: 'general' });
    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    createdPost = res.body;
  });

  test('GET /api/posts lists posts with pagination & filter branch', async () => {
    const res = await request(app).get('/api/posts?category=general&page=1&limit=10');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find(p => p._id === createdPost._id)).toBeDefined();
  });

  test('GET /api/posts/:id returns post', async () => {
    const res = await request(app).get(`/api/posts/${createdPost._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(createdPost._id);
  });

  test('GET /api/posts/:id not found branch', async () => {
    const res = await request(app).get('/api/posts/does-not-exist');
    expect(res.status).toBe(404);
  });

  test('PUT /api/posts/:id forbidden branch for non-author', async () => {
    const res = await request(app)
      .put(`/api/posts/${createdPost._id}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'Hacked' });
    expect(res.status).toBe(403);
  });

  test('PUT /api/posts/:id not found branch', async () => {
    const res = await request(app)
      .put('/api/posts/unknown-id')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Will not work' });
    expect(res.status).toBe(404);
  });

  test('PUT /api/posts/:id updates post (200)', async () => {
    const res = await request(app)
      .put(`/api/posts/${createdPost._id}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Updated Title' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  test('DELETE /api/posts/:id forbidden branch', async () => {
    const res = await request(app)
      .delete(`/api/posts/${createdPost._id}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.status).toBe(403);
  });

  test('DELETE /api/posts/:id not found branch', async () => {
    const res = await request(app)
      .delete('/api/posts/unknown-id')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(404);
  });

  test('DELETE /api/posts/:id success', async () => {
    const res = await request(app)
      .delete(`/api/posts/${createdPost._id}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Visual regression route returns HTML', async () => {
    const res = await request(app).get('/visual/button');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/<!DOCTYPE html>/);
    expect(res.text).toMatch(/Primary/);
  });
});
