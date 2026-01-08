import { execa } from 'execa';
import ora from 'ora';
import type { Logger } from '../../utils/logger.js';

export async function installNextjs(
  targetDir: string,
  execOptions: { stdio?: 'inherit' },
  logger: Logger
): Promise<void> {
  const spinner = ora('Creating Next.js app...').start();
  
  try {
    logger.debug('Running create-next-app...');
    // Use shell command with 'echo' to automatically answer React Compiler prompt
    await execa(
      'sh',
      ['-c', `echo "n" | npx create-next-app@latest ${targetDir} --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --no-git`],
      execOptions
    );
    
    spinner.succeed('Next.js app created');
  } catch (error) {
    spinner.fail('Failed to create Next.js app');
    throw error;
  }
}
