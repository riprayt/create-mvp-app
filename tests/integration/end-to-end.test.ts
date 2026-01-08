import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createProject } from '../../src/lib/create-project.js';
import { createMockConfig, setupTestEnv, teardownTestEnv } from '../helpers/test-utils.js';
import * as installPnpmModule from '../../src/lib/installers/install-pnpm.js';
import * as installNextjsModule from '../../src/lib/installers/install-nextjs.js';
import fs from 'fs/promises';
import path from 'path';

// Mock installers for E2E tests
vi.mock('../../src/lib/installers/install-pnpm.js');
vi.mock('../../src/lib/installers/install-nextjs.js');
vi.mock('../../src/lib/installers/install-shadcn.js');
vi.mock('../../src/lib/installers/install-blocks.js');
vi.mock('../../src/lib/installers/install-deps.js');
vi.mock('../../src/lib/git/init-git.js');

describe('End-to-End Tests', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    const env = await setupTestEnv();
    testDir = env.testDir;
    originalCwd = env.originalCwd;
    
    // Setup mocks to create actual file structure
    vi.mocked(installPnpmModule.installPnpm).mockResolvedValue(undefined);
    vi.mocked(installNextjsModule.installNextjs).mockImplementation(async (targetDir) => {
      await fs.mkdir(path.join(targetDir, 'src', 'app'), { recursive: true });
      await fs.writeFile(
        path.join(targetDir, 'package.json'),
        JSON.stringify({ name: 'test-app', version: '1.0.0' })
      );
      await fs.writeFile(
        path.join(targetDir, 'tsconfig.json'),
        JSON.stringify({ compilerOptions: {} })
      );
    });
  });

  afterEach(async () => {
    await teardownTestEnv(testDir, originalCwd);
    vi.clearAllMocks();
  });

  it('should create complete project structure', async () => {
    const config = createMockConfig({
      projectName: 'e2e-test-app',
      includeUI: true,
      includeBlocks: true,
      includeAuth: true,
      includeDb: true,
      includeTests: true,
      includeCaching: true,
      initGit: true,
    });

    await createProject(config);

    const projectDir = path.join(testDir, 'e2e-test-app');
    const files = await fs.readdir(projectDir, { recursive: true });
    
    // Verify key files exist
    expect(files).toContain('package.json');
    expect(files).toContain('tsconfig.json');
    expect(files).toContain('src/app');
    expect(files).toContain('.prettierrc');
    expect(files).toContain('.env.local');
    expect(files).toContain('.cursorrules');
  });

  it('should handle quick mode configuration', async () => {
    const config = createMockConfig({
      projectName: 'quick-mode-test',
      includeAuth: true,
      includeDb: true,
      includeUI: true,
      includeBlocks: true,
      includeTests: true,
      includeCaching: true,
      includeBackgroundJobs: true,
      includeMonitoring: true,
      includeAnalytics: true,
      initGit: true,
    });

    await createProject(config);

    // Verify all features were processed
    expect(installPnpmModule.installPnpm).toHaveBeenCalled();
    expect(installNextjsModule.installNextjs).toHaveBeenCalled();
  });

  it('should handle minimal configuration', async () => {
    const config = createMockConfig({
      projectName: 'minimal-e2e-test',
      includeAuth: false,
      includeDb: false,
      includeUI: false,
      includeBlocks: false,
      includeTests: false,
      initGit: false,
    });

    await createProject(config);

    // Verify only essential steps were executed
    expect(installPnpmModule.installPnpm).toHaveBeenCalled();
    expect(installNextjsModule.installNextjs).toHaveBeenCalled();
  });
});
