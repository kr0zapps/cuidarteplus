import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
  timeout: 30000,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    headless: true,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
});
