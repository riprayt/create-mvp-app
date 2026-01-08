import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createProject } from '../../src/lib/create-project.js';
import { createMockConfig, setupTestEnv, teardownTestEnv, assertFileExists } from '../helpers/test-utils.ts';
import * as installPnpmModule from '../../src/lib/installers/install-pnpm.js';
import * as installNextjsModule from '../../src/lib/installers/install-nextjs.js';
import * as installShadcnModule from '../../src/lib/installers/install-shadcn.js';
import * as installBlocksModule from '../../src/lib/installers/install-blocks.js';
import * as installDepsModule from '../../src/lib/installers/install-deps.js';
import * as initGitModule from '../../src/lib/git/init-git.js';
import fs from 'fs/promises';
import path from 'path';

// Mock all installers
vi.mock('../../src/lib/installers/install-pnpm.js');
vi.mock('../../src/lib/installers/install-nextjs.js');
vi.mock('../../src/lib/installers/install-shadcn.js');
vi.mock('../../src/lib/installers/install-blocks.js');
vi.mock('../../src/lib/installers/install-deps.js');
vi.mock('../../src/lib/git/init-git.js');

describe('createProject - Integration Tests', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    const env = await setupTestEnv();
    testDir = env.testDir;
    originalCwd = env.originalCwd;
    
    // Setup mocks
    vi.mocked(installPnpmModule.installPnpm).mockResolvedValue(undefined);
    vi.mocked(installNextjsModule.installNextjs).mockImplementation(async (targetDir) => {
      // Create mock Next.js project structure
      await fs.mkdir(path.join(targetDir, 'src', 'app'), { recursive: true });
      await fs.writeFile(path.join(targetDir, 'package.json'), JSON.stringify({ name: 'test-app' }));
    });
    vi.mocked(installShadcnModule.installShadcn).mockResolvedValue(undefined);
    vi.mocked(installBlocksModule.installBlocks).mockResolvedValue(undefined);
    vi.mocked(installDepsModule.installDependencies).mockResolvedValue(undefined);
    vi.mocked(installDepsModule.installDevDependencies).mockResolvedValue(undefined);
    vi.mocked(initGitModule.initGit).mockResolvedValue(undefined);
  });

  afterEach(async () => {
    await teardownTestEnv(testDir, originalCwd);
    vi.clearAllMocks();
  });

  it('should create project with minimal configuration', async () => {
    const config = createMockConfig({
      projectName: 'minimal-test',
      includeAuth: false,
      includeDb: false,
      includeUI: false,
      includeBlocks: false,
      includeTests: false,
      initGit: false,
    });

    await createProject(config);

    // Verify installers were called
    expect(installPnpmModule.installPnpm).toHaveBeenCalled();
    expect(installNextjsModule.installNextjs).toHaveBeenCalled();
    expect(installShadcnModule.installShadcn).not.toHaveBeenCalled();
    expect(installBlocksModule.installBlocks).not.toHaveBeenCalled();
    expect(initGitModule.initGit).not.toHaveBeenCalled();
  });

  it('should create project with all features enabled', async () => {
    const config = createMockConfig({
      projectName: 'full-featured-test',
      includeAuth: true,
      includeDb: true,
      includeUI: true,
      includeBlocks: true,
      includeTests: true,
      includeCaching: true,
      includeMonitoring: true,
      initGit: true,
    });

    await createProject(config);

    // Verify all installers were called
    expect(installPnpmModule.installPnpm).toHaveBeenCalled();
    expect(installNextjsModule.installNextjs).toHaveBeenCalled();
    expect(installShadcnModule.installShadcn).toHaveBeenCalled();
    expect(installDepsModule.installDependencies).toHaveBeenCalled();
    expect(installDepsModule.installDevDependencies).toHaveBeenCalled();
    expect(installBlocksModule.installBlocks).toHaveBeenCalled();
    expect(initGitModule.initGit).toHaveBeenCalled();
  });

  it('should generate all config files', async () => {
    const config = createMockConfig({
      projectName: 'config-test',
      includeBlocks: true,
    });

    await createProject(config);

    // Change to project directory to check files
    const projectDir = path.join(testDir, 'config-test');
    process.chdir(projectDir);

    // Verify config files were created
    await assertFileExists('.prettierrc');
    await assertFileExists('.vscode/settings.json');
    await assertFileExists('.env.local');
    await assertFileExists('.cursorrules');
    await assertFileExists('src/app/page.tsx');
  });

  it('should throw error if directory already exists', async () => {
    const config = createMockConfig({ projectName: 'existing-dir' });
    
    // Create the directory first
    const targetDir = path.join(testDir, 'existing-dir');
    await fs.mkdir(targetDir, { recursive: true });

    await expect(createProject(config)).rejects.toThrow('already exists');
  });

  it('should generate production libs when features are enabled', async () => {
    const config = createMockConfig({
      projectName: 'prod-libs-test',
      includeCaching: true,
      includeBackgroundJobs: true,
      includeMonitoring: true,
    });

    await createProject(config);

    const projectDir = path.join(testDir, 'prod-libs-test');
    process.chdir(projectDir);

    await assertFileExists('src/lib/redis.ts');
    await assertFileExists('src/lib/inngest.ts');
    await assertFileExists('sentry.client.config.ts');
  });
});
