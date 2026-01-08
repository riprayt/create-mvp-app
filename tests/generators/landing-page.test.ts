import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateLandingPage } from '../../src/lib/generators/landing-page.js';
import { setupTestEnv, teardownTestEnv, assertFileExists, assertFileContent } from '../helpers/test-utils.js';

describe('generateLandingPage', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    const env = await setupTestEnv();
    testDir = env.testDir;
    originalCwd = env.originalCwd;
    // Create src/app directory structure
    await import('fs/promises').then(fs => fs.mkdir('src/app', { recursive: true }));
  });

  afterEach(async () => {
    await teardownTestEnv(testDir, originalCwd);
  });

  it('should create src/app/page.tsx file', async () => {
    await generateLandingPage('Test App');
    await assertFileExists('src/app/page.tsx');
  });

  it('should include brand name in the landing page', async () => {
    await generateLandingPage('My Awesome App');
    await assertFileContent('src/app/page.tsx', 'My Awesome App');
  });

  it('should include all required component imports', async () => {
    await generateLandingPage('Test App');
    await assertFileContent('src/app/page.tsx', 'Navbar1');
    await assertFileContent('src/app/page.tsx', 'Hero3');
    await assertFileContent('src/app/page.tsx', 'Feature13');
    await assertFileContent('src/app/page.tsx', 'Footer2');
  });

  it('should include create-mvp-app badge in hero', async () => {
    await generateLandingPage('Test App');
    await assertFileContent('src/app/page.tsx', 'Built with Create MVP App');
  });

  it('should include GitHub link in navbar', async () => {
    await generateLandingPage('Test App');
    await assertFileContent('src/app/page.tsx', 'https://github.com/riprayt/create-mvp-app');
  });

  it('should handle different brand names correctly', async () => {
    await generateLandingPage('Another Brand Name');
    await assertFileContent('src/app/page.tsx', 'Another Brand Name');
  });
});
