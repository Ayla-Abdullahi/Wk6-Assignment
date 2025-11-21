import { test, expect } from '@playwright/test';

// E2E API flow using Playwright's request context against Express server
test.describe('API auth and posts flow', () => {
  test('register -> login -> create -> list -> delete', async ({ request }) => {
    const email = `user${Date.now()}@test.dev`;
    const password = 'Secret123!';

    // Register (route returns id, username, email)
    const reg = await request.post('/api/auth/register', { data: { username: 'e2eUser', email, password } });
    expect(reg.ok()).toBeTruthy();
    const regBody = await reg.json();
    expect(regBody).toHaveProperty('id');
    expect(regBody).toHaveProperty('email', email);

    // Login
    const login = await request.post('/api/auth/login', { data: { email, password } });
    expect(login.ok()).toBeTruthy();
    const { token } = await login.json();
    expect(token).toBeTruthy();

    // Create post
    const create = await request.post('/api/posts', {
      data: { title: 'E2E Post', content: 'Body', category: 'e2e' },
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(create.status()).toBe(201);
    const created = await create.json();
    expect(created.title).toBe('E2E Post');

    // List posts (filter by category)
    const list = await request.get('/api/posts?category=e2e');
    expect(list.ok()).toBeTruthy();
    const posts = await list.json();
    const found = posts.find(p => p._id === created._id);
    expect(found).toBeTruthy();

    // Delete post
    const del = await request.delete(`/api/posts/${created._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(del.ok()).toBeTruthy();
    const delBody = await del.json();
    expect(delBody.success).toBe(true);
  });
});
