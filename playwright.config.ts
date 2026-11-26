import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      testIgnore: /responsive\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        // set PW_CHROME_PATH to use an already installed Chrome locally
        launchOptions: { executablePath: process.env.PW_CHROME_PATH || undefined },
      },
    },
    {
      name: "mobile",
      testMatch: /responsive\.spec\.ts/,
      use: {
        ...devices["Pixel 5"],
        launchOptions: { executablePath: process.env.PW_CHROME_PATH || undefined },
      },
    },
  ],
  webServer: {
    command: `CI=false npm run build && npx serve -s build -l ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
