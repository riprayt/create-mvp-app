import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { type ProjectConfig } from '../types.js';

export async function createProject(config: ProjectConfig) {
  const targetDir = path.join(process.cwd(), config.projectName);
  const debugMode = config.debugMode;

  const log = (message: string) => {
    if (debugMode) {
      console.log(chalk.gray(`[DEBUG] ${message}`));
    }
  };

  const execOptions = debugMode ? { stdio: 'inherit' as const } : {};

  log(`Target directory: ${targetDir}`);
  log(`Configuration: ${JSON.stringify(config, null, 2)}`);

  // Check if directory exists
  try {
    await fs.access(targetDir);
    throw new Error(`Directory ${config.projectName} already exists`);
  } catch (error: any) {
    if (error.code !== 'ENOENT') throw error;
  }

  // 1. Install pnpm
  let spinner = ora('Installing latest pnpm...').start();
  try {
    log('Enabling corepack...');
    await execa('corepack', ['enable'], execOptions);
    log('Preparing pnpm...');
    await execa('corepack', ['prepare', 'pnpm@latest', '--activate'], execOptions);
    spinner.succeed('pnpm installed');
  } catch (error) {
    spinner.fail('Failed to install pnpm');
    throw error;
  }

  // 2. Create Next.js app
  spinner = ora('Creating Next.js app...').start();
  try {
    log('Running create-next-app...');
    await execa('npx', [
      'create-next-app@latest',
      targetDir,
      '--typescript',
      '--tailwind',
      '--eslint',
      '--app',
      '--src-dir',
      '--import-alias',
      '@/*',
      '--use-pnpm',
      '--no-git',
    ], execOptions);
    spinner.succeed('Next.js app created');
  } catch (error) {
    spinner.fail('Failed to create Next.js app');
    throw error;
  }

  log(`Changing directory to ${targetDir}`);
  process.chdir(targetDir);

  // 3. Install Shadcn UI
  if (config.includeUI) {
    spinner = ora('Installing Shadcn UI...').start();
    try {
      log('Installing shadcn init...');
      await execa('pnpm', ['dlx', 'shadcn@latest', 'init', '-d'], execOptions);
      log('Adding all shadcn components...');
      await execa('pnpm', ['dlx', 'shadcn@latest', 'add', '--all'], execOptions);
      spinner.succeed('Shadcn UI installed');
    } catch (error) {
      spinner.fail('Failed to install Shadcn UI');
      throw error;
    }
  }

  // 4. Install dependencies
  spinner = ora('Installing dependencies...').start();
  try {
    const deps = ['lucide-react', 'zod', 'sonner', 'next-themes', 'react-hook-form', '@hookform/resolvers'];
    
    if (config.includeAuth) {
      deps.push('@clerk/nextjs');
      log('Adding Clerk to dependencies');
    }
    
    if (config.includeDb) {
      deps.push('@supabase/supabase-js');
      log('Adding Supabase to dependencies');
    }
    
    if (config.includeAuth || config.includeDb) {
      deps.push('@t3-oss/env-nextjs');
      log('Adding env validation');
    }

    // Production features
    if (config.includeCaching) {
      deps.push('@upstash/redis', '@upstash/ratelimit');
      log('Adding Upstash Redis for caching & rate limiting');
    }

    if (config.includeBackgroundJobs) {
      deps.push('inngest');
      log('Adding Inngest for background jobs');
    }

    if (config.includeWebhooks) {
      deps.push('svix');
      log('Adding Svix for webhooks');
    }

    if (config.includeFeatureFlags) {
      deps.push('@vercel/flags');
      log('Adding Vercel Flags for feature flags');
    }

    if (config.includeABTesting) {
      deps.push('@vercel/edge-config');
      log('Adding Vercel Edge Config for A/B testing');
    }

    if (config.includeMonitoring) {
      deps.push('@sentry/nextjs');
      log('Adding Sentry for error monitoring');
    }

    if (config.includeAnalytics) {
      deps.push('@vercel/analytics', '@vercel/speed-insights');
      log('Adding Vercel Analytics & Speed Insights');
    }

    log(`Installing: ${deps.join(', ')}`);
    await execa('pnpm', ['add', ...deps], execOptions);
    spinner.succeed('Dependencies installed');
  } catch (error) {
    spinner.fail('Failed to install dependencies');
    throw error;
  }

  // 5. Install dev dependencies
  if (config.includeTests) {
    spinner = ora('Installing dev dependencies...').start();
    try {
      log('Installing testing libraries...');
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

  // 6. Install Shadcn Blocks
  if (config.includeBlocks) {
    spinner = ora('Installing Shadcn Blocks (this may take a while)...').start();
    try {
      const blocks = [
        'about3', 'address-book1', 'awards1', 'background-pattern1', 'banner1',
        'blog7', 'blogpost1', 'book-a-demo1', 'careers4', 'case-studies2',
        'case-study8', 'changelog1', 'checkout1', 'code-example1', 'community1',
        'compare-products1', 'compare7', 'compliance1', 'contact7', 'content1',
        'cta10', 'cta11', 'download2', 'ecommerce-footer1', 'experience1',
        'experience5', 'faq1', 'feature1', 'feature13', 'feature166',
        'feature17', 'feature197', 'feature2', 'feature43', 'feature51',
        'feature72', 'feature73', 'footer2', 'gallery6', 'help1',
        'hero1', 'hero115', 'hero3', 'hero45', 'hero47',
        'hero7', 'incentives1', 'industries1', 'integration3', 'list2',
        'live-purchase1', 'login1', 'logos8', 'navbar1', 'offer-modal4',
        'order-summary1', 'payment-methods1', 'pricing2', 'pricing4', 'pricing6',
        'process1', 'product-card1', 'product-categories1', 'product-detail1', 'product-gallery1',
        'product-list1', 'product-quick-view4', 'product-specs1', 'project1', 'promo-banner1',
        'rate-card2', 'resource1', 'reviews1', 'service1', 'services4',
        'shader3', 'shopping-cart1', 'signup1', 'stats8', 'team1',
        'testimonial10', 'timeline9', 'trust-strip1', 'waitlist1', 'wishlist1',
      ];

      log(`Installing ${blocks.length} Shadcn blocks...`);
      for (const block of blocks) {
        log(`Installing block: ${block}`);
        await execa('sh', ['-c', `yes n | pnpm dlx shadcn add @shadcnblocks/${block} -y`], debugMode ? { stdio: 'inherit' as const } : {});
      }
      spinner.succeed('Shadcn Blocks installed');
    } catch (error) {
      spinner.warn('Some Shadcn Blocks may have failed to install');
    }
  }

  // 7. Create configuration files
  spinner = ora('Creating configuration files...').start();
  try {
    log('Creating config files...');
    await createConfigFiles(config);
    spinner.succeed('Configuration files created');
  } catch (error) {
    spinner.fail('Failed to create configuration files');
    throw error;
  }

  // 8. Initialize Git (after all files are created)
  if (config.initGit) {
    spinner = ora('Initializing Git repository...').start();
    try {
      log('Initializing git...');
      await execa('git', ['init'], execOptions);
      log('Adding all files...');
      await execa('git', ['add', '-A'], execOptions);
      log('Creating initial commit...');
      await execa('git', ['commit', '-m', 'Initial commit via create-mvp-app', '--no-verify'], execOptions);
      spinner.succeed('Git repository initialized');
    } catch (error) {
      spinner.warn('Git initialization skipped');
      if (debugMode) {
        console.log(chalk.yellow(`Git error: ${error}`));
      }
    }
  }
}

async function createConfigFiles(config: ProjectConfig) {
  // Create all necessary configuration files and components
  // This would include all the files from the bash script
  // For brevity, showing structure - you'd add all the actual file contents here
  
  // Prettier config
  await fs.writeFile('.prettierrc', JSON.stringify({
    semi: true,
    trailingComma: 'es5',
    singleQuote: false,
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
  }, null, 2));

  // VS Code settings for AI development
  await fs.mkdir('.vscode', { recursive: true });
  const vscodeSettings = {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    },
    "typescript.tsdk": "node_modules/typescript/lib",
    "typescript.enablePromptUseWorkspaceTsdk": true,
    "files.associations": {
      "*.css": "tailwindcss"
    },
    "tailwindCSS.experimental.classRegex": [
      ["cva\\(([^)]*)\\)", "[\"\`]([^\"\`]*).*?[\"\`]"],
      ["cn\\(([^)]*)\\)", "[\"\`]([^\"\`]*).*?[\"\`]"]
    ]
  };
  await fs.writeFile('.vscode/settings.json', JSON.stringify(vscodeSettings, null, 2));

  // Cursor rules for AI development
  const cursorRules = `# AI Development Rules for ${config.projectName}

## Project Context
This is a Next.js 15 application built with the App Router, TypeScript, and Tailwind CSS.

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn UI
${config.includeAuth ? '- **Auth**: Clerk\n' : ''}${config.includeDb ? '- **Database**: Supabase (PostgreSQL)\n' : ''}${config.includeTests ? '- **Testing**: Vitest + Playwright\n' : ''}${config.includeCaching ? '- **Caching**: Upstash Redis\n' : ''}${config.includeBackgroundJobs ? '- **Background Jobs**: Inngest\n' : ''}${config.includeMonitoring ? '- **Monitoring**: Sentry\n' : ''}
## Code Style Rules

1. **Use Server Components by default**
   - Only add 'use client' when necessary (useState, useEffect, browser APIs, event handlers)
   - Fetch data in Server Components when possible

2. **File Naming**
   - Components: PascalCase (e.g., \`UserProfile.tsx\`)
   - Utilities: camelCase (e.g., \`formatDate.ts\`)
   - Pages/Routes: kebab-case (e.g., \`user-profile/page.tsx\`)

3. **Import Order**
   \`\`\`typescript
   // 1. React/Next imports
   import { useState } from 'react';
   import Image from 'next/image';
   
   // 2. External libraries
   import { clsx } from 'clsx';
   
   // 3. Internal components
   import { Button } from '@/components/ui/button';
   
   // 4. Internal utilities
   import { cn } from '@/lib/utils';
   
   // 5. Types
   import type { User } from '@/types';
   \`\`\`

4. **TypeScript**
   - Always define types/interfaces
   - Use \`type\` for unions, \`interface\` for objects
   - Avoid \`any\`, use \`unknown\` if needed

5. **Component Structure**
   \`\`\`typescript
   // Props interface first
   interface ComponentProps {
     title: string;
     onAction?: () => void;
   }
   
   // Component
   export function Component({ title, onAction }: ComponentProps) {
     // Hooks first
     const [state, setState] = useState();
     
     // Event handlers
     const handleClick = () => {};
     
     // Render
     return <div>...</div>;
   }
   \`\`\`

## Next.js Patterns

1. **Data Fetching**
   \`\`\`typescript
   // Server Component (preferred)
   async function Page() {
     const data = await fetch('...').then(r => r.json());
     return <div>{data}</div>;
   }
   
   // Client Component (when needed)
   'use client'
   function Page() {
     const { data } = useSWR('/api/data');
     return <div>{data}</div>;
   }
   \`\`\`

2. **Route Handlers**
   \`\`\`typescript
   // app/api/users/route.ts
   import { NextResponse } from 'next/server';
   
   export async function GET(request: Request) {
     const data = await fetchData();
     return NextResponse.json(data);
   }
   \`\`\`

3. **Metadata**
   \`\`\`typescript
   export const metadata = {
     title: 'Page Title',
     description: 'Page description',
   };
   \`\`\`

## Tailwind/Shadcn Patterns

1. **Use cn() utility for conditional classes**
   \`\`\`typescript
   import { cn } from '@/lib/utils';
   
   <div className={cn(
     "base-classes",
     variant === "primary" && "primary-classes",
     className
   )} />
   \`\`\`

2. **Shadcn Components**
   - Import from \`@/components/ui\`
   - Customize in place or wrap for project-specific logic
   - Use built-in variants when available

${config.includeAuth ? `## Authentication (Clerk)

1. **Protected Routes**
   \`\`\`typescript
   import { auth } from '@clerk/nextjs';
   
   export default async function ProtectedPage() {
     const { userId } = auth();
     if (!userId) redirect('/sign-in');
     // ...
   }
   \`\`\`

2. **Client Components**
   \`\`\`typescript
   'use client'
   import { useUser } from '@clerk/nextjs';
   
   export function UserProfile() {
     const { user } = useUser();
     return <div>{user?.firstName}</div>;
   }
   \`\`\`
` : ''}
${config.includeDb ? `## Database (Supabase)

1. **Server-side queries**
   \`\`\`typescript
   import { createClient } from '@/lib/supabase/server';
   
   export async function getData() {
     const supabase = createClient();
     const { data } = await supabase.from('table').select('*');
     return data;
   }
   \`\`\`

2. **Client-side queries**
   \`\`\`typescript
   'use client'
   import { createClient } from '@/lib/supabase/client';
   
   const supabase = createClient();
   const { data } = await supabase.from('table').select('*');
   \`\`\`
` : ''}
${config.includeCaching ? `## Caching (Redis)

1. **Rate Limiting**
   \`\`\`typescript
   import { ratelimit } from '@/lib/redis';
   
   const { success } = await ratelimit.limit(identifier);
   if (!success) return new Response('Too many requests', { status: 429 });
   \`\`\`

2. **Data Caching**
   \`\`\`typescript
   import { redis } from '@/lib/redis';
   
   const cached = await redis.get(key);
   if (cached) return cached;
   
   const data = await fetchData();
   await redis.set(key, data, { ex: 3600 });
   \`\`\`
` : ''}
## Performance Best Practices

1. **Images**: Always use next/image
2. **Fonts**: Use next/font
3. **Dynamic imports**: For heavy components
4. **Streaming**: Use Suspense and loading.tsx
5. **Caching**: Use ISR and cache() for data fetching

## Common Mistakes to Avoid

- ❌ Using 'use client' unnecessarily
- ❌ Fetching data in client components when server components would work
- ❌ Not using TypeScript types
- ❌ Ignoring ESLint warnings
- ❌ Not using Image component for images
- ❌ Hardcoding API URLs (use env variables)

## When to Ask for Clarification

- New external API integration
- Database schema changes
- Authentication flow modifications
- Major architectural decisions

## Helpful Commands

\`\`\`bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm type-check   # Check TypeScript
${config.includeTests ? 'pnpm test        # Run tests\n' : ''}\`\`\`

---

**Remember**: Prioritize code quality, type safety, and user experience. When in doubt, ask!
`;
  await fs.writeFile('.cursorrules', cursorRules);

  // TypeScript config updates, middleware, layouts, etc.
  // ... (all the file creation logic from the bash script)
  
  // Environment variables
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

