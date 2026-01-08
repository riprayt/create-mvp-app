import { describe, it, expect, beforeEach, vi } from 'vitest';
import { installShadcn } from '../../src/lib/installers/install-shadcn.js';
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

describe('installShadcn', () => {
  const mockExeca = vi.mocked(execaModule.execa);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize and add all Shadcn components', async () => {
    mockExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
    
    const logger = createLogger(false);
    await installShadcn({}, logger);

    expect(mockExeca).toHaveBeenCalledWith('pnpm', ['dlx', 'shadcn@latest', 'init', '-d'], {});
    expect(mockExeca).toHaveBeenCalledWith('pnpm', ['dlx', 'shadcn@latest', 'add', '--all'], {});
  });
});
