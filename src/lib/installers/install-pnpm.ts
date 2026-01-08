import { execa } from 'execa';
import ora from 'ora';
import type { Logger } from '../../utils/logger.js';

export async function installPnpm(
  execOptions: { stdio?: 'inherit' },
  logger: Logger
): Promise<void> {
  const spinner = ora('Installing latest pnpm...').start();
  
  try {
    logger.debug('Enabling corepack...');
    await execa('corepack', ['enable'], execOptions);
    
    logger.debug('Preparing pnpm...');
    await execa('corepack', ['prepare', 'pnpm@latest', '--activate'], execOptions);
    
    spinner.succeed('pnpm installed');
  } catch (error) {
    spinner.fail('Failed to install pnpm');
    throw error;
  }
}
