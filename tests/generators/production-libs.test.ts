import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateProductionLibs } from '../../src/lib/generators/production-libs.js';
import { setupTestEnv, teardownTestEnv, createMockConfig, assertFileExists, assertFileNotExists, assertFileContent } from '../helpers/test-utils.js';

describe('generateProductionLibs', () => {
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

  describe('Redis (Caching)', () => {
    it('should create redis.ts when caching is enabled', async () => {
      const config = createMockConfig({ includeCaching: true });
      await generateProductionLibs(config);
      await assertFileExists('src/lib/redis.ts');
    });

    it('should not create redis.ts when caching is disabled', async () => {
      const config = createMockConfig({ includeCaching: false });
      await generateProductionLibs(config);
      await assertFileNotExists('src/lib/redis.ts');
    });

    it('should include Redis and Ratelimit imports', async () => {
      const config = createMockConfig({ includeCaching: true });
      await generateProductionLibs(config);
      await assertFileContent('src/lib/redis.ts', '@upstash/redis');
      await assertFileContent('src/lib/redis.ts', '@upstash/ratelimit');
    });

    it('should export redis and ratelimit', async () => {
      const config = createMockConfig({ includeCaching: true });
      await generateProductionLibs(config);
      await assertFileContent('src/lib/redis.ts', 'export const redis');
      await assertFileContent('src/lib/redis.ts', 'export const ratelimit');
    });
  });

  describe('Inngest (Background Jobs)', () => {
    it('should create inngest.ts when background jobs are enabled', async () => {
      const config = createMockConfig({ includeBackgroundJobs: true });
      await generateProductionLibs(config);
      await assertFileExists('src/lib/inngest.ts');
    });

    it('should not create inngest.ts when background jobs are disabled', async () => {
      const config = createMockConfig({ includeBackgroundJobs: false });
      await generateProductionLibs(config);
      await assertFileNotExists('src/lib/inngest.ts');
    });

    it('should include Inngest import and export', async () => {
      const config = createMockConfig({ includeBackgroundJobs: true });
      await generateProductionLibs(config);
      await assertFileContent('src/lib/inngest.ts', 'inngest');
      await assertFileContent('src/lib/inngest.ts', 'export const inngest');
    });
  });

  describe('Sentry (Monitoring)', () => {
    it('should create Sentry config files when monitoring is enabled', async () => {
      const config = createMockConfig({ includeMonitoring: true });
      await generateProductionLibs(config);
      await assertFileExists('sentry.client.config.ts');
      await assertFileExists('sentry.server.config.ts');
      await assertFileExists('sentry.edge.config.ts');
    });

    it('should not create Sentry files when monitoring is disabled', async () => {
      const config = createMockConfig({ includeMonitoring: false });
      await generateProductionLibs(config);
      await assertFileNotExists('sentry.client.config.ts');
      await assertFileNotExists('sentry.server.config.ts');
      await assertFileNotExists('sentry.edge.config.ts');
    });

    it('should include Sentry initialization in all config files', async () => {
      const config = createMockConfig({ includeMonitoring: true });
      await generateProductionLibs(config);
      await assertFileContent('sentry.client.config.ts', '@sentry/nextjs');
      await assertFileContent('sentry.server.config.ts', '@sentry/nextjs');
      await assertFileContent('sentry.edge.config.ts', '@sentry/nextjs');
      await assertFileContent('sentry.client.config.ts', 'Sentry.init');
    });
  });

  describe('Multiple Features', () => {
    it('should create all files when all features are enabled', async () => {
      const config = createMockConfig({
        includeCaching: true,
        includeBackgroundJobs: true,
        includeMonitoring: true,
      });
      await generateProductionLibs(config);
      await assertFileExists('src/lib/redis.ts');
      await assertFileExists('src/lib/inngest.ts');
      await assertFileExists('sentry.client.config.ts');
    });
  });
});
