import { describe, it, expect, beforeEach, vi } from 'vitest';
import { installDependencies, installDevDependencies } from '../../src/lib/installers/install-deps.js';
import { createMockConfig } from '../helpers/test-utils.js';
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

describe('installDependencies', () => {
  const mockExeca = vi.mocked(execaModule.execa);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should install base dependencies', async () => {
    mockExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
    
    const config = createMockConfig();
    const logger = createLogger(false);
    
    await installDependencies(config, {}, logger);

    expect(mockExeca).toHaveBeenCalledWith(
      'pnpm',
      expect.arrayContaining(['add', 'lucide-react', 'zod', 'sonner']),
      {}
    );
  });

  it('should include Clerk when auth is enabled', async () => {
    mockExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
    
    const config = createMockConfig({ includeAuth: true });
    const logger = createLogger(true);
    const debugSpy = vi.spyOn(logger, 'debug');
    
    await installDependencies(config, {}, logger);

    expect(mockExeca).toHaveBeenCalledWith(
      'pnpm',
      expect.arrayContaining(['add', '@clerk/nextjs']),
      {}
    );
    expect(debugSpy).toHaveBeenCalledWith('Adding Clerk to dependencies');
  });

  it('should include Supabase when db is enabled', async () => {
    mockExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
    
    const config = createMockConfig({ includeDb: true });
    const logger = createLogger(true);
    const debugSpy = vi.spyOn(logger, 'debug');
    
    await installDependencies(config, {}, logger);

    expect(mockExeca).toHaveBeenCalledWith(
      'pnpm',
      expect.arrayContaining(['add', '@supabase/supabase-js']),
      {}
    );
    expect(debugSpy).toHaveBeenCalledWith('Adding Supabase to dependencies');
  });

  it('should include Redis when caching is enabled', async () => {
    mockExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
    
    const config = createMockConfig({ includeCaching: true });
    const logger = createLogger(false);
    
    await installDependencies(config, {}, logger);

    const callArgs = mockExeca.mock.calls[0][1] as string[];
    expect(callArgs).toContain('@upstash/redis');
    expect(callArgs).toContain('@upstash/ratelimit');
  });

  it('should include all production dependencies when all features enabled', async () => {
    mockExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
    
    const config = createMockConfig({
      includeAuth: true,
      includeDb: true,
      includeCaching: true,
      includeBackgroundJobs: true,
      includeWebhooks: true,
      includeFeatureFlags: true,
      includeMonitoring: true,
      includeAnalytics: true,
    });
    const logger = createLogger(false);
    
    await installDependencies(config, {}, logger);

    const callArgs = mockExeca.mock.calls[0][1] as string[];
    expect(callArgs).toContain('@clerk/nextjs');
    expect(callArgs).toContain('@supabase/supabase-js');
    expect(callArgs).toContain('@upstash/redis');
    expect(callArgs).toContain('inngest');
    expect(callArgs).toContain('svix');
    expect(callArgs).toContain('@vercel/flags');
    expect(callArgs).toContain('@sentry/nextjs');
    expect(callArgs).toContain('@vercel/analytics');
  });
});

describe('installDevDependencies', () => {
  const mockExeca = vi.mocked(execaModule.execa);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should install dev dependencies', async () => {
    mockExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
    
    const config = createMockConfig();
    const logger = createLogger(false);
    
    await installDevDependencies(config, {}, logger);

    expect(mockExeca).toHaveBeenCalledWith(
      'pnpm',
      expect.arrayContaining(['add', '-D', 'vitest', '@playwright/test']),
      {}
    );
  });
});
