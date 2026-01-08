import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initGit } from '../../src/lib/git/init-git.js';
import { createLogger } from '../../src/utils/logger.js';
import { setupTestEnv, teardownTestEnv } from '../helpers/test-utils.js';
import * as execaModule from 'execa';

vi.mock('execa');
vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn(() => ({
      succeed: vi.fn(),
      warn: vi.fn(),
    })),
  })),
}));

describe('initGit', () => {
  let testDir: string;
  let originalCwd: string;
  const mockExeca = vi.mocked(execaModule.execa);

  beforeEach(async () => {
    const env = await setupTestEnv();
    testDir = env.testDir;
    originalCwd = env.originalCwd;
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await teardownTestEnv(testDir, originalCwd);
  });

  it('should initialize git repository successfully', async () => {
    mockExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
    
    const logger = createLogger(false);
    await initGit({}, logger);

    expect(mockExeca).toHaveBeenCalledWith('git', ['init'], {});
    expect(mockExeca).toHaveBeenCalledWith('git', ['add', '-A'], {});
    expect(mockExeca).toHaveBeenCalledWith('git', ['commit', '-m', 'Initial commit via create-mvp-app', '--no-verify'], {});
  });

  it('should handle git initialization errors gracefully', async () => {
    mockExeca.mockRejectedValue(new Error('Git not found'));
    
    const logger = createLogger(false);
    await expect(initGit({}, logger)).resolves.not.toThrow();
  });

  it('should log debug messages when debug mode is enabled', async () => {
    mockExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
    
    const logger = createLogger(true);
    const debugSpy = vi.spyOn(logger, 'debug');
    
    await initGit({}, logger);

    expect(debugSpy).toHaveBeenCalledWith('Initializing git...');
    expect(debugSpy).toHaveBeenCalledWith('Adding all files...');
    expect(debugSpy).toHaveBeenCalledWith('Creating initial commit...');
  });
});
