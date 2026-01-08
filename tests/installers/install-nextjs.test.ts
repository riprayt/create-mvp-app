import { describe, it, expect, beforeEach, vi } from 'vitest';
import { installNextjs } from '../../src/lib/installers/install-nextjs.js';
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

describe('installNextjs', () => {
  const mockExeca = vi.mocked(execaModule.execa);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create Next.js app with correct parameters', async () => {
    mockExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
    
    const logger = createLogger(false);
    await installNextjs('/tmp/test-app', {}, logger);

    expect(mockExeca).toHaveBeenCalledWith(
      'sh',
      expect.arrayContaining(['-c']),
      {}
    );
    
    const command = mockExeca.mock.calls[0][1][1] as string;
    expect(command).toContain('create-next-app@latest');
    expect(command).toContain('/tmp/test-app');
    expect(command).toContain('--typescript');
    expect(command).toContain('--tailwind');
  });
});
