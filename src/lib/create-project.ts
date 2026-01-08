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
    ], {
      input: 'n\n', // Answer no to React compiler
      shell: true,
      ...execOptions,
    });
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

  // 8. Initialize Git
  if (config.initGit) {
    spinner = ora('Initializing Git repository...').start();
    try {
      log('Initializing git...');
      await execa('git', ['init'], execOptions);
      log('Adding files...');
      await execa('git', ['add', '.'], execOptions);
      log('Creating initial commit...');
      await execa('git', ['commit', '-m', 'Initial commit via create-mvp-app'], execOptions);
      spinner.succeed('Git repository initialized');
    } catch (error) {
      spinner.warn('Git initialization skipped');
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

  // TypeScript config updates, middleware, layouts, etc.
  // ... (all the file creation logic from the bash script)
  
  // Environment variables
  const envContent = `# Clerk Auth Keys (Get from: https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${config.envVars.clerkPublishableKey || 'pk_test_...'}
CLERK_SECRET_KEY=${config.envVars.clerkSecretKey || 'sk_test_...'}

# Supabase Keys (Get from: https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=${config.envVars.supabaseUrl || 'https://your-project.supabase.co'}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${config.envVars.supabaseAnonKey || 'your-anon-key'}
`;

  await fs.writeFile('.env.local', envContent);
}
