import { defineConfig } from '@playwright/test';

// Consolidated Playwright config
export default defineConfig({
  testDir: './e2e/tests',
  retries: 0,
  use: {
    baseURL: 'http://localhost:4000',
    headless: true,
    trace: 'on-first-retry'
  },
  reporter: [['list']]
});
