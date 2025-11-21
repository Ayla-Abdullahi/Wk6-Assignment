const request = require('supertest');
const app = require('../../src/app');

describe('Auth Routes', () => {
  it('registers a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({ username: 'alice', email: 'a@example.com', password: 'pass123' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining({ username: 'alice', email: 'a@example.com' }));
  });

  it('prevents duplicate email registrations', async () => {
    await request(app).post('/api/auth/register').send({ username: 'bob', email: 'dup@example.com', password: 'x' });
    const res = await request(app).post('/api/auth/register').send({ username: 'charlie', email: 'dup@example.com', password: 'x' });
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already/);
  });

  it('logs in registered user and returns token', async () => {
    await request(app).post('/api/auth/register').send({ username: 'dave', email: 'd@example.com', password: 'pass' });
    const res = await request(app).post('/api/auth/login').send({ email: 'd@example.com', password: 'pass' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects invalid login credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nope@example.com', password: 'none' });
    expect(res.status).toBe(401);
  });
});
