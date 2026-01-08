import { execa } from 'execa';
import ora from 'ora';
import type { Logger } from '../../utils/logger.js';

export async function installShadcn(
  execOptions: { stdio?: 'inherit' },
  logger: Logger
): Promise<void> {
  const spinner = ora('Installing Shadcn UI...').start();
  
  try {
    logger.debug('Installing shadcn init...');
    await execa('pnpm', ['dlx', 'shadcn@latest', 'init', '-d'], execOptions);
    
    logger.debug('Adding all shadcn components...');
    await execa('pnpm', ['dlx', 'shadcn@latest', 'add', '--all'], execOptions);
    
    spinner.succeed('Shadcn UI installed');
  } catch (error) {
    spinner.fail('Failed to install Shadcn UI');
    throw error;
  }
}
