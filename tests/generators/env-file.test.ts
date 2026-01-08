import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateEnvFile } from '../../src/lib/generators/env-file.js';
import { setupTestEnv, teardownTestEnv, createMockConfig, assertFileExists, assertFileContent, assertFileNotContent } from '../helpers/test-utils.ts';

describe('generateEnvFile', () => {
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

  it('should create .env.local file', async () => {
    const config = createMockConfig();
    await generateEnvFile(config);
    await assertFileExists('.env.local');
  });

  it('should include Clerk environment variables', async () => {
    const config = createMockConfig();
    await generateEnvFile(config);
    await assertFileContent('.env.local', 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
    await assertFileContent('.env.local', 'CLERK_SECRET_KEY');
  });

  it('should include Supabase environment variables', async () => {
    const config = createMockConfig();
    await generateEnvFile(config);
    await assertFileContent('.env.local', 'NEXT_PUBLIC_SUPABASE_URL');
    await assertFileContent('.env.local', 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
  });

  it('should include Redis variables when caching is enabled', async () => {
    const config = createMockConfig({ includeCaching: true });
    await generateEnvFile(config);
    await assertFileContent('.env.local', 'UPSTASH_REDIS_REST_URL');
    await assertFileContent('.env.local', 'UPSTASH_REDIS_REST_TOKEN');
  });

  it('should exclude Redis variables when caching is disabled', async () => {
    const config = createMockConfig({ includeCaching: false });
    await generateEnvFile(config);
    await assertFileNotContent('.env.local', 'UPSTASH_REDIS');
  });

  it('should include Inngest variables when background jobs are enabled', async () => {
    const config = createMockConfig({ includeBackgroundJobs: true });
    await generateEnvFile(config);
    await assertFileContent('.env.local', 'INNGEST_EVENT_KEY');
    await assertFileContent('.env.local', 'INNGEST_SIGNING_KEY');
  });

  it('should include webhook secret when webhooks are enabled', async () => {
    const config = createMockConfig({ includeWebhooks: true });
    await generateEnvFile(config);
    await assertFileContent('.env.local', 'WEBHOOK_SECRET');
  });

  it('should include Sentry DSN when monitoring is enabled', async () => {
    const config = createMockConfig({ includeMonitoring: true });
    await generateEnvFile(config);
    await assertFileContent('.env.local', 'SENTRY_DSN');
  });

  it('should include Edge Config when feature flags or A/B testing are enabled', async () => {
    const config = createMockConfig({ includeFeatureFlags: true });
    await generateEnvFile(config);
    await assertFileContent('.env.local', 'EDGE_CONFIG');
  });

  it('should include Edge Config when A/B testing is enabled', async () => {
    const config = createMockConfig({ includeABTesting: true });
    await generateEnvFile(config);
    await assertFileContent('.env.local', 'EDGE_CONFIG');
  });

  it('should use provided environment variable values', async () => {
    const config = createMockConfig({
      envVars: {
        clerkPublishableKey: 'pk_custom',
        clerkSecretKey: 'sk_custom',
        supabaseUrl: 'https://custom.supabase.co',
        supabaseAnonKey: 'custom-key',
      },
    });
    await generateEnvFile(config);
    await assertFileContent('.env.local', 'pk_custom');
    await assertFileContent('.env.local', 'sk_custom');
    await assertFileContent('.env.local', 'https://custom.supabase.co');
  });
});
