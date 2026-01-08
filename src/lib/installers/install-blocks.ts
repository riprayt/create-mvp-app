import { execa } from 'execa';
import ora from 'ora';
import type { Logger } from '../../utils/logger.js';

export async function installBlocks(
  blocks: string[],
  debugMode: boolean,
  logger: Logger
): Promise<void> {
  const spinner = ora('Installing Shadcn Blocks (this may take a while)...').start();
  
  try {
    logger.debug(`Installing ${blocks.length} Shadcn blocks...`);
    
    for (const block of blocks) {
      logger.debug(`Installing block: ${block}`);
      await execa(
        'sh',
        ['-c', `yes n | pnpm dlx shadcn add @shadcnblocks/${block} -y`],
        debugMode ? { stdio: 'inherit' as const } : {}
      );
    }
    
    spinner.succeed('Shadcn Blocks installed');
  } catch (error) {
    spinner.warn('Some Shadcn Blocks may have failed to install');
    // Don't throw - blocks installation failures shouldn't stop the whole process
  }
}
