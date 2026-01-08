import fs from 'fs/promises';
import path from 'path';
import type { ProjectConfig } from '../types.js';
import { createLogger } from '../utils/logger.js';
import { projectNameToBrandName } from '../utils/brand-name.js';
import { SHADCN_BLOCKS } from '../utils/constants.js';
import { installPnpm } from './installers/install-pnpm.js';
import { installNextjs } from './installers/install-nextjs.js';
import { installShadcn } from './installers/install-shadcn.js';
import { installBlocks } from './installers/install-blocks.js';
import { installDependencies, installDevDependencies } from './installers/install-deps.js';
import { generateConfigFiles } from './generators/config-files.js';
import { generateEnvFile } from './generators/env-file.js';
import { generateCursorRules } from './generators/cursor-rules.js';
import { generateProductionLibs } from './generators/production-libs.js';
import { generateLandingPage } from './generators/landing-page.js';
import { initGit } from './git/init-git.js';

/**
 * Main project creation orchestrator
 * Coordinates all installers and generators to create a complete MVP project
 */
export async function createProject(config: ProjectConfig) {
  const targetDir = path.join(process.cwd(), config.projectName);
  const logger = createLogger(config.debugMode);
  const execOptions = config.debugMode ? { stdio: 'inherit' as const } : {};

  logger.debug(`Target directory: ${targetDir}`);
  logger.debug(`Configuration: ${JSON.stringify(config, null, 2)}`);

  // Check if directory exists
  try {
    await fs.access(targetDir);
    throw new Error(`Directory ${config.projectName} already exists`);
  } catch (error: any) {
    if (error.code !== 'ENOENT') throw error;
  }

  // 1. Install pnpm
  await installPnpm(execOptions, logger);

  // 2. Create Next.js app
  await installNextjs(targetDir, execOptions, logger);

  // Change to project directory
  logger.debug(`Changing directory to ${targetDir}`);
  process.chdir(targetDir);

  // 3. Install Shadcn UI
  if (config.includeUI) {
    await installShadcn(execOptions, logger);
  }

  // 4. Install dependencies
  await installDependencies(config, execOptions, logger);

  // 5. Install dev dependencies
  if (config.includeTests) {
    await installDevDependencies(config, execOptions, logger);
  }

  // 6. Install Shadcn Blocks
  if (config.includeBlocks) {
    await installBlocks(SHADCN_BLOCKS, config.debugMode, logger);
  }

  // 7. Generate configuration files
  const brandName = projectNameToBrandName(config.projectName);
  await generateConfigFiles();
  await generateEnvFile(config);
  await generateCursorRules(config);
  await generateProductionLibs(config);

  // 8. Generate landing page
  if (config.includeBlocks) {
    await generateLandingPage(brandName);
  }

  // 9. Initialize Git
  if (config.initGit) {
    await initGit(execOptions, logger);
  }
}
