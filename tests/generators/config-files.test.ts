import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateConfigFiles } from '../../src/lib/generators/config-files.js';
import { setupTestEnv, teardownTestEnv, assertFileExists, assertFileContent } from '../helpers/test-utils.js';

describe('generateConfigFiles', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    const env = await setupTestEnv();
    testDir = env.testDir;
    originalCwd = env.originalCwd;
  });

  afterEach(async () => {
    await teardownTestEnv(testDir, originalCwd);
  });

  it('should create .prettierrc file', async () => {
    await generateConfigFiles();
    await assertFileExists('.prettierrc');
  });

  it('should create .vscode/settings.json file', async () => {
    await generateConfigFiles();
    await assertFileExists('.vscode/settings.json');
  });

  it('should generate valid Prettier config', async () => {
    await generateConfigFiles();
    await assertFileContent('.prettierrc', '"semi": true');
    await assertFileContent('.prettierrc', '"trailingComma": "es5"');
    await assertFileContent('.prettierrc', '"printWidth": 80');
  });

  it('should generate VSCode settings with correct formatter', async () => {
    await generateConfigFiles();
    await assertFileContent('.vscode/settings.json', 'esbenp.prettier-vscode');
    await assertFileContent('.vscode/settings.json', 'formatOnSave');
  });

  it('should include Tailwind CSS configuration in VSCode settings', async () => {
    await generateConfigFiles();
    await assertFileContent('.vscode/settings.json', 'tailwindCSS');
    await assertFileContent('.vscode/settings.json', 'experimental.classRegex');
  });
});
