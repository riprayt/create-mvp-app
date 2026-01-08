import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { generateCursorRules } from './cursor-rules.js';
import type { ProjectConfig } from '../../types.js';

describe('generateCursorRules', () => {
  let testDir: string;
  let originalCwd: string;
  
  beforeEach(async () => {
    // Create a unique temp directory for each test
    testDir = path.join(os.tmpdir(), `cursor-rules-test-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
    
    // Save original working directory and change to test dir
    originalCwd = process.cwd();
    process.chdir(testDir);
  });
  
  afterEach(async () => {
    // Restore original working directory
    process.chdir(originalCwd);
    
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });
  
  const createConfig = (overrides: Partial<ProjectConfig> = {}): ProjectConfig => ({
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
  });
  
  describe('Template Reading and File Generation', () => {
    it('should create .cursorrules file', async () => {
      const config = createConfig();
      
      await generateCursorRules(config);
      
      const exists = await fs.access('.cursorrules')
        .then(() => true)
        .catch(() => false);
      
      expect(exists).toBe(true);
    });
    
    it('should generate non-empty content', async () => {
      const config = createConfig();
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content.length).toBeGreaterThan(100);
    });
  });
  
  describe('Variable Substitution', () => {
    it('should include project name in the generated file', async () => {
      const config = createConfig({ projectName: 'my-awesome-app' });
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).toContain('my-awesome-app');
    });
    
    it('should handle different project names correctly', async () => {
      const config = createConfig({ projectName: 'another-project-123' });
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).toContain('another-project-123');
    });
  });
  
  describe('Conditional Sections - Authentication', () => {
    it('should include auth section when includeAuth is true', async () => {
      const config = createConfig({ includeAuth: true });
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).toContain('## Authentication (Clerk)');
      expect(content).toContain('Protected Routes');
      expect(content).toContain('@clerk/nextjs');
    });
    
    it('should exclude auth section when includeAuth is false', async () => {
      const config = createConfig({ includeAuth: false });
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).not.toContain('## Authentication (Clerk)');
      expect(content).not.toContain('Protected Routes');
    });
  });
  
  describe('Conditional Sections - Database', () => {
    it('should include database section when includeDb is true', async () => {
      const config = createConfig({ includeDb: true });
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).toContain('## Database (Supabase)');
      expect(content).toContain('Server-side queries');
      expect(content).toContain('createClient');
    });
    
    it('should exclude database section when includeDb is false', async () => {
      const config = createConfig({ includeDb: false });
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).not.toContain('## Database (Supabase)');
    });
  });
  
  describe('Conditional Sections - Caching', () => {
    it('should include caching section when includeCaching is true', async () => {
      const config = createConfig({ includeCaching: true });
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).toContain('## Caching (Redis)');
      expect(content).toContain('Rate Limiting');
      expect(content).toContain('Data Caching');
      expect(content).toContain('ratelimit');
    });
    
    it('should exclude caching section when includeCaching is false', async () => {
      const config = createConfig({ includeCaching: false });
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).not.toContain('## Caching (Redis)');
    });
  });
  
  describe('Conditional Sections - Testing', () => {
    it('should include test command when includeTests is true', async () => {
      const config = createConfig({ includeTests: true });
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).toContain('pnpm test');
    });
    
    it('should exclude test command when includeTests is false', async () => {
      const config = createConfig({ includeTests: false });
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      // Should not have the test command line
      const lines = content.split('\n');
      const testCommandLine = lines.find(line => line.trim() === 'pnpm test        # Run tests');
      expect(testCommandLine).toBeUndefined();
    });
  });
  
  describe('Core Content Always Present', () => {
    it('should always include scalability guidelines', async () => {
      const config = createConfig();
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).toContain('Scalable Architecture Guidelines');
      expect(content).toContain('File Size Limits');
      expect(content).toContain('Service Layer Pattern');
      expect(content).toContain('Repository Pattern');
    });
    
    it('should always include code style rules', async () => {
      const config = createConfig();
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).toContain('Code Style Rules');
      expect(content).toContain('Use Server Components by default');
      expect(content).toContain('File Naming');
      expect(content).toContain('Import Order');
    });
    
    it('should always include Next.js patterns', async () => {
      const config = createConfig();
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).toContain('Next.js Patterns');
      expect(content).toContain('Data Fetching');
      expect(content).toContain('Route Handlers');
    });
    
    it('should always include performance best practices', async () => {
      const config = createConfig();
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).toContain('Performance & Scalability Best Practices');
      expect(content).toContain('Code Splitting');
      expect(content).toContain('Memoization');
    });
    
    it('should always include scalability checklist', async () => {
      const config = createConfig();
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).toContain('Scalability Checklist');
      expect(content).toContain('Application Growth Strategy');
      expect(content).toContain('When to Refactor');
    });
  });
  
  describe('Tech Stack Section', () => {
    it('should include all selected technologies in tech stack', async () => {
      const config = createConfig({
        includeAuth: true,
        includeDb: true,
        includeTests: true,
        includeCaching: true,
        includeBackgroundJobs: true,
        includeMonitoring: true,
      });
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).toContain('**Auth**: Clerk');
      expect(content).toContain('**Database**: Supabase (PostgreSQL)');
      expect(content).toContain('**Testing**: Vitest + Playwright');
      expect(content).toContain('**Caching**: Upstash Redis');
      expect(content).toContain('**Background Jobs**: Inngest');
      expect(content).toContain('**Monitoring**: Sentry');
    });
    
    it('should only include basic stack when no optional features selected', async () => {
      const config = createConfig({
        includeAuth: false,
        includeDb: false,
        includeTests: false,
        includeCaching: false,
        includeBackgroundJobs: false,
        includeMonitoring: false,
      });
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      expect(content).toContain('**Framework**: Next.js 15');
      expect(content).toContain('**Language**: TypeScript');
      expect(content).toContain('**Styling**: Tailwind CSS + Shadcn UI');
      expect(content).not.toContain('**Auth**: Clerk');
      expect(content).not.toContain('**Database**: Supabase');
    });
  });
  
  describe('Multiple Features Combined', () => {
    it('should handle all features enabled correctly', async () => {
      const config = createConfig({
        projectName: 'full-featured-app',
        includeAuth: true,
        includeDb: true,
        includeTests: true,
        includeCaching: true,
        includeBackgroundJobs: true,
        includeMonitoring: true,
      });
      
      await generateCursorRules(config);
      
      const content = await fs.readFile('.cursorrules', 'utf-8');
      
      // Check project name
      expect(content).toContain('full-featured-app');
      
      // Check all conditional sections are present
      expect(content).toContain('## Authentication (Clerk)');
      expect(content).toContain('## Database (Supabase)');
      expect(content).toContain('## Caching (Redis)');
      expect(content).toContain('pnpm test');
      
      // Check core content is still there
      expect(content).toContain('Scalable Architecture Guidelines');
    });
  });
});
