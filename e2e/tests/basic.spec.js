import { test, expect } from '@playwright/test';

test('posts endpoint returns array', async ({ request }) => {
  const res = await request.get('/api/posts');
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(Array.isArray(json)).toBe(true);
});
