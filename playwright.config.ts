import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const API_PORT = 3200;
const chrome = { executablePath: process.env.PW_CHROME_PATH || undefined };

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "desktop",
      testDir: "./e2e/tests/ui",
      testIgnore: /responsive\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], launchOptions: chrome },
    },
    {
      name: "mobile",
      testDir: "./e2e/tests/ui",
      testMatch: /responsive\.spec\.ts/,
      use: { ...devices["Pixel 5"], launchOptions: chrome },
    },
    {
      name: "api",
      testDir: "./e2e/tests/api",
      use: { ...devices["Desktop Chrome"], baseURL: `http://localhost:${API_PORT}` },
    },
  ],

  webServer: [
    {
      command: `CI=false REACT_APP_FAKE_AUTH=true npm run build && npx serve -s build -l ${PORT}`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 240_000,
    },
    {
      command: "node server/api-dev.mjs",
      url: `http://localhost:${API_PORT}/api/products`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
});
