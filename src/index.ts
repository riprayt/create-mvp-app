#!/usr/bin/env node

import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { execa } from 'execa';
import { createProject } from './lib/create-project.js';
import { type ProjectConfig } from './types.js';

const program = new Command();

program
  .name('create-mvp-app')
  .description('Create a production-ready Next.js MVP with authentication, database, and UI components')
  .version('1.0.0')
  .argument('[project-name]', 'Name of your project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('-d, --debug', 'Show detailed logs and command output')
  .option('--no-auth', 'Skip authentication setup')
  .option('--no-db', 'Skip database setup')
  .option('--no-ui', 'Skip Shadcn UI components')
  .option('--no-blocks', 'Skip Shadcn Blocks')
  .option('--no-tests', 'Skip testing setup')
  .option('--no-git', 'Skip git initialization')
  .option('--clerk-key <key>', 'Clerk publishable key')
  .option('--clerk-secret <secret>', 'Clerk secret key')
  .option('--supabase-url <url>', 'Supabase project URL')
  .option('--supabase-key <key>', 'Supabase anon key')
  .option('--open', 'Open project in VS Code after creation')
  .action(async (projectName, options) => {
    console.log(chalk.blue.bold('\n🚀 Create MVP App\n'));

    // Enable debug mode
    const debugMode = options.debug || false;
    if (debugMode) {
      console.log(chalk.yellow('🐛 Debug mode enabled - showing detailed logs\n'));
    }

    let config: ProjectConfig;

    if (options.yes) {
      // Quick mode with defaults
      if (!projectName) {
        console.error(chalk.red('❌ Project name is required in quick mode'));
        process.exit(1);
      }

      config = {
        projectName,
        includeAuth: options.auth !== false,
        includeDb: options.db !== false,
        includeUI: options.ui !== false,
        includeBlocks: options.blocks !== false,
        includeTests: options.tests !== false,
        initGit: options.git !== false,
        debugMode,
        envVars: {
          clerkPublishableKey: options.clerkKey || '',
          clerkSecretKey: options.clerkSecret || '',
          supabaseUrl: options.supabaseUrl || '',
          supabaseAnonKey: options.supabaseKey || '',
        },
        openInVSCode: options.open || false,
      };
    } else {
      // Interactive mode
      const responses = await prompts([
        {
          type: projectName ? null : 'text',
          name: 'projectName',
          message: 'What is your project name?',
          initial: 'my-mvp-app',
          validate: (value) =>
            /^[a-z0-9-]+$/.test(value) || 'Project name must be lowercase with hyphens only',
        },
        {
          type: 'multiselect',
          name: 'features',
          message: 'Select features to include:',
          choices: [
            { title: 'Authentication (Clerk)', value: 'auth', selected: true },
            { title: 'Database (Supabase)', value: 'db', selected: true },
            { title: 'Shadcn UI Components', value: 'ui', selected: true },
            { title: 'Shadcn Blocks (90+ components)', value: 'blocks', selected: true },
            { title: 'Testing (Vitest + Playwright)', value: 'tests', selected: true },
          ],
          hint: 'Space to select, Enter to confirm',
        },
        {
          type: 'confirm',
          name: 'initGit',
          message: 'Initialize Git repository?',
          initial: true,
        },
        {
          type: 'confirm',
          name: 'provideEnvVars',
          message: 'Would you like to provide environment variables now?',
          initial: false,
        },
        {
          type: 'confirm',
          name: 'openInVSCode',
          message: 'Open project in VS Code after creation?',
          initial: true,
        },
      ]);

      if (responses.projectName === undefined && !projectName) {
        console.log(chalk.yellow('\n👋 Setup cancelled'));
        process.exit(0);
      }

      const features = responses.features || [];
      let envVars = {
        clerkPublishableKey: '',
        clerkSecretKey: '',
        supabaseUrl: '',
        supabaseAnonKey: '',
      };

      if (responses.provideEnvVars && features.includes('auth')) {
        const authEnv = await prompts([
          {
            type: 'text',
            name: 'clerkPublishableKey',
            message: 'Clerk Publishable Key (leave empty to skip):',
          },
          {
            type: 'password',
            name: 'clerkSecretKey',
            message: 'Clerk Secret Key (leave empty to skip):',
          },
        ]);
        envVars = { ...envVars, ...authEnv };
      }

      if (responses.provideEnvVars && features.includes('db')) {
        const dbEnv = await prompts([
          {
            type: 'text',
            name: 'supabaseUrl',
            message: 'Supabase Project URL (leave empty to skip):',
          },
          {
            type: 'password',
            name: 'supabaseAnonKey',
            message: 'Supabase Anon Key (leave empty to skip):',
          },
        ]);
        envVars = { ...envVars, ...dbEnv };
      }

      config = {
        projectName: projectName || responses.projectName,
        includeAuth: features.includes('auth'),
        includeDb: features.includes('db'),
        includeUI: features.includes('ui'),
        includeBlocks: features.includes('blocks'),
        includeTests: features.includes('tests'),
        initGit: responses.initGit,
        debugMode,
        envVars,
        openInVSCode: responses.openInVSCode,
      };
    }

    // Create the project
    try {
      await createProject(config);
      
      console.log(chalk.green.bold('\n✅ Setup Complete!\n'));
      
      // Open in Cursor if requested
      if (config.openInVSCode) {
        const spinner = ora('Opening in Cursor...').start();
        try {
          // After createProject, cwd is already the project directory
          await execa('cursor', ['.']);
          spinner.succeed('Opened in Cursor!');
        } catch (error) {
          spinner.warn('Could not open Cursor automatically');
          if (debugMode) {
            console.log(chalk.yellow('Make sure Cursor is installed and "cursor" command is in PATH'));
          }
        }
      }
      
      console.log(chalk.blue('👉 Next Steps:\n'));
      console.log(`   cd ${config.projectName}`);
      
      if (!config.envVars.clerkPublishableKey && config.includeAuth) {
        console.log('   Add your Clerk keys to .env.local');
      }
      if (!config.envVars.supabaseUrl && config.includeDb) {
        console.log('   Add your Supabase keys to .env.local');
      }
      
      console.log('   pnpm dev\n');
    } catch (error) {
      console.error(chalk.red('\n❌ Error creating project:'), error);
      process.exit(1);
    }
  });

program.parse();
