import { execa } from 'execa';
import ora from 'ora';
import type { ProjectConfig } from '../../types.js';
import type { Logger } from '../../utils/logger.js';

export async function installDependencies(
  config: ProjectConfig,
  execOptions: { stdio?: 'inherit' },
  logger: Logger
): Promise<void> {
  const spinner = ora('Installing dependencies...').start();
  
  try {
    const deps = ['lucide-react', 'zod', 'sonner', 'next-themes', 'react-hook-form', '@hookform/resolvers'];
    
    if (config.includeAuth) {
      deps.push('@clerk/nextjs');
      logger.debug('Adding Clerk to dependencies');
    }
    
    if (config.includeDb) {
      deps.push('@supabase/supabase-js');
      logger.debug('Adding Supabase to dependencies');
    }
    
    if (config.includeAuth || config.includeDb) {
      deps.push('@t3-oss/env-nextjs');
      logger.debug('Adding env validation');
    }

    // Production features
    if (config.includeCaching) {
      deps.push('@upstash/redis', '@upstash/ratelimit');
      logger.debug('Adding Upstash Redis for caching & rate limiting');
    }

    if (config.includeBackgroundJobs) {
      deps.push('inngest');
      logger.debug('Adding Inngest for background jobs');
    }

    if (config.includeWebhooks) {
      deps.push('svix');
      logger.debug('Adding Svix for webhooks');
    }

    if (config.includeFeatureFlags) {
      deps.push('@vercel/flags');
      logger.debug('Adding Vercel Flags for feature flags');
    }

    if (config.includeABTesting) {
      deps.push('@vercel/edge-config');
      logger.debug('Adding Vercel Edge Config for A/B testing');
    }

    if (config.includeMonitoring) {
      deps.push('@sentry/nextjs');
      logger.debug('Adding Sentry for error monitoring');
    }

    if (config.includeAnalytics) {
      deps.push('@vercel/analytics', '@vercel/speed-insights');
      logger.debug('Adding Vercel Analytics & Speed Insights');
    }

    logger.debug(`Installing: ${deps.join(', ')}`);
    await execa('pnpm', ['add', ...deps], execOptions);
    
    spinner.succeed('Dependencies installed');
  } catch (error) {
    spinner.fail('Failed to install dependencies');
    throw error;
  }
}

export async function installDevDependencies(
  config: ProjectConfig,
  execOptions: { stdio?: 'inherit' },
  logger: Logger
): Promise<void> {
  const spinner = ora('Installing dev dependencies...').start();
  
  try {
    logger.debug('Installing testing libraries...');
    await execa('pnpm', [
      'add',
      '-D',
      '@testing-library/react',
      '@testing-library/jest-dom',
      '@vitejs/plugin-react',
      'vitest',
      '@playwright/test',
      'prettier',
      'eslint-config-prettier',
      'husky',
      'lint-staged',
    ], execOptions);
    
    spinner.succeed('Dev dependencies installed');
  } catch (error) {
    spinner.fail('Failed to install dev dependencies');
    throw error;
  }
}
