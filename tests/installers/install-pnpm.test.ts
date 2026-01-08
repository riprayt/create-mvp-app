import { describe, it, expect, beforeEach, vi } from 'vitest';
import { installPnpm } from '../../src/lib/installers/install-pnpm.js';
import { createLogger } from '../../src/utils/logger.js';
import * as execaModule from 'execa';

vi.mock('execa');
vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn(() => ({
      succeed: vi.fn(),
      fail: vi.fn(),
    })),
  })),
}));

describe('installPnpm', () => {
  const mockExeca = vi.mocked(execaModule.execa);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should enable corepack and prepare pnpm', async () => {
    mockExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
    
    const logger = createLogger(false);
    await installPnpm({}, logger);

    expect(mockExeca).toHaveBeenCalledWith('corepack', ['enable'], {});
    expect(mockExeca).toHaveBeenCalledWith('corepack', ['prepare', 'pnpm@latest', '--activate'], {});
  });

  it('should throw error on failure', async () => {
    mockExeca.mockRejectedValue(new Error('Corepack failed'));
    
    const logger = createLogger(false);
    await expect(installPnpm({}, logger)).rejects.toThrow();
  });

  it('should log debug messages when debug mode is enabled', async () => {
    mockExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
    
    const logger = createLogger(true);
    const debugSpy = vi.spyOn(logger, 'debug');
    
    await installPnpm({}, logger);

    expect(debugSpy).toHaveBeenCalledWith('Enabling corepack...');
    expect(debugSpy).toHaveBeenCalledWith('Preparing pnpm...');
  });
});
