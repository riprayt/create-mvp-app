import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import type { ProjectConfig } from '../../src/types.js';

/**
 * Creates an isolated test directory
 */
export async function createTestDir(prefix = 'test'): Promise<string> {
  const testDir = path.join(os.tmpdir(), `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`);
  await fs.mkdir(testDir, { recursive: true });
  return testDir;
}

/**
 * Cleans up a test directory
 */
export async function cleanupTestDir(testDir: string): Promise<void> {
  try {
    await fs.rm(testDir, { recursive: true, force: true });
  } catch (error) {
    // Ignore cleanup errors
  }
}

/**
 * Creates a mock ProjectConfig for testing
 */
export function createMockConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  return {
    projectName: 'test-app',
    includeAuth: false,
    includeDb: false,
    includeUI: true,
    includeBlocks: true,
    includeTests: false,
    initGit: true,
    debugMode: false,
    includeCaching: false,
    includeBackgroundJobs: false,
    includeWebhooks: false,
    includeMultiTenancy: false,
    includeFeatureFlags: false,
    includeABTesting: false,
    includeMonitoring: false,
    includeAnalytics: false,
    envVars: {
      clerkPublishableKey: '',
      clerkSecretKey: '',
      supabaseUrl: '',
      supabaseAnonKey: '',
    },
    ...overrides,
  };
}

/**
 * Asserts that a file exists
 */
export async function assertFileExists(filePath: string): Promise<void> {
  try {
    await fs.access(filePath);
  } catch (error) {
    throw new Error(`Expected file to exist: ${filePath}`);
  }
}

/**
 * Asserts that a file does not exist
 */
export async function assertFileNotExists(filePath: string): Promise<void> {
  try {
    await fs.access(filePath);
    throw new Error(`Expected file to not exist: ${filePath}`);
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * Asserts that file content contains a string
 */
export async function assertFileContent(filePath: string, expectedContent: string): Promise<void> {
  const content = await fs.readFile(filePath, 'utf-8');
  if (!content.includes(expectedContent)) {
    throw new Error(`Expected file ${filePath} to contain "${expectedContent}"`);
  }
}

/**
 * Asserts that file content does not contain a string
 */
export async function assertFileNotContent(filePath: string, unexpectedContent: string): Promise<void> {
  const content = await fs.readFile(filePath, 'utf-8');
  if (content.includes(unexpectedContent)) {
    throw new Error(`Expected file ${filePath} to not contain "${unexpectedContent}"`);
  }
}

/**
 * Gets file content as string
 */
export async function getFileContent(filePath: string): Promise<string> {
  return await fs.readFile(filePath, 'utf-8');
}

/**
 * Sets up a test environment with working directory change
 */
export async function setupTestEnv(): Promise<{ testDir: string; originalCwd: string }> {
  const testDir = await createTestDir();
  const originalCwd = process.cwd();
  process.chdir(testDir);
  return { testDir, originalCwd };
}

/**
 * Tears down test environment and restores working directory
 */
export async function teardownTestEnv(testDir: string, originalCwd: string): Promise<void> {
  process.chdir(originalCwd);
  await cleanupTestDir(testDir);
}

/**
 * Creates a mock execa function for testing
 */
export function createMockExeca(success = true, output = '') {
  return async (...args: any[]) => {
    if (!success) {
      const error: any = new Error('Mock execa error');
      error.exitCode = 1;
      throw error;
    }
    return { stdout: output, stderr: '', exitCode: 0 };
  };
}

/**
 * Waits for a specified number of milliseconds
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
