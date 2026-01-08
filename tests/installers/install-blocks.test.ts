import { describe, it, expect, beforeEach, vi } from 'vitest';
import { installBlocks } from '../../src/lib/installers/install-blocks.js';
import { createLogger } from '../../src/utils/logger.js';
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

describe('installBlocks', () => {
  const mockExeca = vi.mocked(execaModule.execa);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should install all blocks', async () => {
    mockExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
    
    const blocks = ['navbar1', 'hero3', 'footer2'];
    const logger = createLogger(false);
    
    await installBlocks(blocks, false, logger);

    expect(mockExeca).toHaveBeenCalledTimes(blocks.length);
  });

  it('should handle installation errors gracefully', async () => {
    mockExeca.mockRejectedValue(new Error('Block installation failed'));
    
    const blocks = ['navbar1'];
    const logger = createLogger(false);
    
    await expect(installBlocks(blocks, false, logger)).resolves.not.toThrow();
  });
});
