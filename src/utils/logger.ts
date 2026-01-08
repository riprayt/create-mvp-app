import chalk from 'chalk';

export interface Logger {
  debug: (message: string) => void;
  info: (message: string) => void;
  error: (message: string) => void;
  success: (message: string) => void;
  warn: (message: string) => void;
}

/**
 * Creates a logger instance with debug mode support
 */
export function createLogger(debugMode: boolean): Logger {
  return {
    debug: (message: string) => {
      if (debugMode) {
        console.log(chalk.gray(`[DEBUG] ${message}`));
      }
    },
    info: (message: string) => console.log(chalk.blue(message)),
    error: (message: string) => console.error(chalk.red(message)),
    success: (message: string) => console.log(chalk.green(message)),
    warn: (message: string) => console.log(chalk.yellow(message)),
  };
}
