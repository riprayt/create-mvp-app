import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import type { Logger } from '../../utils/logger.js';

/**
 * Initializes a Git repository
 */
export async function initGit(
  execOptions: { stdio?: 'inherit' },
  logger: Logger
): Promise<void> {
  const spinner = ora('Initializing Git repository...').start();
  
  try {
    logger.debug('Initializing git...');
    await execa('git', ['init'], execOptions);
    
    logger.debug('Adding all files...');
    await execa('git', ['add', '-A'], execOptions);
    
    logger.debug('Creating initial commit...');
    await execa('git', ['commit', '-m', 'Initial commit via create-mvp-app', '--no-verify'], execOptions);
    
    spinner.succeed('Git repository initialized');
  } catch (error) {
    spinner.warn('Git initialization skipped');
    logger.debug(`Git error: ${error}`);
  }
}
