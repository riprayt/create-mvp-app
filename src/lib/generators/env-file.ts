import fs from 'fs/promises';
import type { ProjectConfig } from '../../types.js';

/**
 * Generates .env.local file with all necessary environment variables
 */
export async function generateEnvFile(config: ProjectConfig): Promise<void> {
  let envContent = `# Clerk Auth Keys (Get from: https://dashboard.clerk.com)\nNEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${config.envVars.clerkPublishableKey || 'pk_test_...'}\nCLERK_SECRET_KEY=${config.envVars.clerkSecretKey || 'sk_test_...'}\n\n# Supabase Keys (Get from: https://supabase.com/dashboard)\nNEXT_PUBLIC_SUPABASE_URL=${config.envVars.supabaseUrl || 'https://your-project.supabase.co'}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${config.envVars.supabaseAnonKey || 'your-anon-key'}\n`;

  // Add production features env vars
  if (config.includeCaching) {
    envContent += `\n# Upstash Redis (Get from: https://console.upstash.com)\nUPSTASH_REDIS_REST_URL=${config.envVars.upstashRedisUrl || 'https://your-redis.upstash.io'}\nUPSTASH_REDIS_REST_TOKEN=${config.envVars.upstashRedisToken || 'your-redis-token'}\n`;
  }

  if (config.includeBackgroundJobs) {
    envContent += `\n# Inngest (Get from: https://www.inngest.com)\nINNGEST_EVENT_KEY=your-inngest-event-key\nINNGEST_SIGNING_KEY=your-inngest-signing-key\n`;
  }

  if (config.includeWebhooks) {
    envContent += `\n# Webhook Signing Secret\nWEBHOOK_SECRET=your-webhook-secret\n`;
  }

  if (config.includeMonitoring) {
    envContent += `\n# Sentry (Get from: https://sentry.io)\nSENTRY_DSN=${config.envVars.sentryDsn || 'https://your-sentry-dsn@sentry.io/project-id'}\n`;
  }

  if (config.includeFeatureFlags || config.includeABTesting) {
    envContent += `\n# Vercel Edge Config (Get from: https://vercel.com/dashboard)\nEDGE_CONFIG=your-edge-config-id\n`;
  }

  await fs.writeFile('.env.local', envContent);
}
