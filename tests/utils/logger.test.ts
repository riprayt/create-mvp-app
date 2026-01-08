import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createLogger } from '../../src/utils/logger.js';

describe('createLogger', () => {
  let originalConsoleLog: typeof console.log;
  let originalConsoleError: typeof console.error;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('debug mode enabled', () => {
    it('should log debug messages when debugMode is true', () => {
      const logger = createLogger(true);
      logger.debug('Test debug message');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should not log debug messages when debugMode is false', () => {
      const logger = createLogger(false);
      logger.debug('Test debug message');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  it('should log info messages', () => {
    const logger = createLogger(false);
    logger.info('Test info message');
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should log error messages', () => {
    const logger = createLogger(false);
    logger.error('Test error message');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should log success messages', () => {
    const logger = createLogger(false);
    logger.success('Test success message');
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should log warn messages', () => {
    const logger = createLogger(false);
    logger.warn('Test warn message');
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should return logger with all required methods', () => {
    const logger = createLogger(false);
    expect(logger).toHaveProperty('debug');
    expect(logger).toHaveProperty('info');
    expect(logger).toHaveProperty('error');
    expect(logger).toHaveProperty('success');
    expect(logger).toHaveProperty('warn');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.success).toBe('function');
    expect(typeof logger.warn).toBe('function');
  });
});
