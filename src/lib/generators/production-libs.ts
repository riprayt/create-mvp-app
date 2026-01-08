import fs from 'fs/promises';
import type { ProjectConfig } from '../../types.js';

/**
 * Generates production library files (Redis, Inngest, Sentry)
 */
export async function generateProductionLibs(config: ProjectConfig): Promise<void> {
  // Create lib files for production features
  if (config.includeCaching) {
    const redisLibContent = `import { Redis } from '@upstash/redis';\nimport { Ratelimit } from '@upstash/ratelimit';\n\nexport const redis = new Redis({\n  url: process.env.UPSTASH_REDIS_REST_URL!,\n  token: process.env.UPSTASH_REDIS_REST_TOKEN!,\n});\n\n// Rate limiting configuration\nexport const ratelimit = new Ratelimit({\n  redis,\n  limiter: Ratelimit.slidingWindow(10, '10 s'),\n  analytics: true,\n});\n`;
    await fs.mkdir('src/lib', { recursive: true });
    await fs.writeFile('src/lib/redis.ts', redisLibContent);
  }

  if (config.includeBackgroundJobs) {
    const inngestContent = `import { Inngest } from 'inngest';\n\nexport const inngest = new Inngest({ id: 'my-app' });\n`;
    await fs.mkdir('src/lib', { recursive: true });
    await fs.writeFile('src/lib/inngest.ts', inngestContent);
  }

  if (config.includeMonitoring) {
    const sentryContent = `import * as Sentry from '@sentry/nextjs';\n\nSentry.init({\n  dsn: process.env.SENTRY_DSN,\n  tracesSampleRate: 1.0,\n  debug: false,\n});\n`;
    await fs.writeFile('sentry.client.config.ts', sentryContent);
    await fs.writeFile('sentry.server.config.ts', sentryContent);
    await fs.writeFile('sentry.edge.config.ts', sentryContent);
  }
}
