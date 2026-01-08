# 🏗️ Architecture Documentation

## Overview

`create-mvp-app` follows a **modular, scalable architecture** where each module has a single, well-defined responsibility. This makes the codebase easy to maintain, test, and extend.

## Design Philosophy

1. **Single Responsibility**: Each file/module does one thing well
2. **Separation of Concerns**: Logic is organized by purpose (install, generate, configure)
3. **Composability**: Small modules combine to create complex functionality
4. **Testability**: Each module can be tested in isolation
5. **Scalability**: Easy to add new features without modifying existing code

## Project Structure

```
src/
├── index.ts                    # CLI entry point (274 lines)
├── types.ts                    # TypeScript type definitions (29 lines)
├── utils/                      # Shared utilities
│   ├── brand-name.ts          # Brand name conversion (10 lines)
│   ├── logger.ts              # Debug logging utilities (28 lines)
│   └── constants.ts           # Shared constants (20 lines)
└── lib/
    ├── create-project.ts      # Main orchestrator (83 lines) ⭐
    ├── installers/            # Package & tool installers
    │   ├── install-pnpm.ts    # pnpm installation (22 lines)
    │   ├── install-nextjs.ts  # Next.js setup (26 lines)
    │   ├── install-shadcn.ts  # Shadcn UI (20 lines)
    │   ├── install-blocks.ts  # Shadcn Blocks (28 lines)
    │   └── install-deps.ts    # Dependencies (115 lines)
    ├── generators/            # File generators
    │   ├── config-files.ts    # Prettier, VSCode (36 lines)
    │   ├── landing-page.ts    # Landing page (161 lines)
    │   ├── env-file.ts        # Environment variables (35 lines)
    │   ├── cursor-rules.ts    # AI dev guidelines (362 lines)
    │   └── production-libs.ts # Redis, Sentry, etc (37 lines)
    └── git/
        └── init-git.ts        # Git initialization (28 lines)
```

## Before vs After Refactoring

### Before (Monolithic)
```
src/
├── index.ts              (274 lines)
├── types.ts              (29 lines)
└── lib/
    └── create-project.ts (713 lines) ⚠️ TOO LARGE!
```

**Problem**: Single 713-line file doing everything

### After (Modular)
```
src/
├── index.ts              (274 lines)
├── types.ts              (29 lines)
├── utils/                (3 files, 58 lines)
└── lib/
    ├── create-project.ts (83 lines) ✅ 90% REDUCTION!
    ├── installers/       (5 files, 211 lines)
    ├── generators/       (5 files, 631 lines)
    └── git/              (1 file, 28 lines)
```

**Benefits**:
- ✅ Main file reduced by 90% (713 → 83 lines)
- ✅ 17 focused, maintainable modules
- ✅ Clear separation of concerns
- ✅ Easy to find and modify specific functionality

## Module Responsibilities

### 1. Utils Module (`src/utils/`)

**Purpose**: Shared utility functions used across the application

**Files**:
- `brand-name.ts`: Converts project names to brand names
- `logger.ts`: Provides debug logging with color-coded output
- `constants.ts`: Shared constants (e.g., list of Shadcn Blocks)

**When to add**: When you have a pure function used in 2+ places

### 2. Installers Module (`src/lib/installers/`)

**Purpose**: Install external tools, packages, and dependencies

**Files**:
- `install-pnpm.ts`: Installs and activates pnpm
- `install-nextjs.ts`: Creates Next.js project
- `install-shadcn.ts`: Installs Shadcn UI components
- `install-blocks.ts`: Installs Shadcn Blocks library
- `install-deps.ts`: Installs runtime and dev dependencies

**Pattern**: Each installer is responsible for ONE tool/package group

**When to add**: When adding a new external dependency or tool

### 3. Generators Module (`src/lib/generators/`)

**Purpose**: Generate configuration files and project code

**Files**:
- `config-files.ts`: Prettier, VSCode settings
- `landing-page.ts`: Landing page template
- `env-file.ts`: Environment variables
- `cursor-rules.ts`: AI development guidelines
- `production-libs.ts`: Production feature libraries

**Pattern**: Each generator creates ONE type of file/feature

**When to add**: When adding a new file generation feature

### 4. Git Module (`src/lib/git/`)

**Purpose**: Git-related operations

**Files**:
- `init-git.ts`: Initialize repository and create initial commit

**When to add**: When adding new git operations (e.g., remote setup, branch creation)

### 5. Main Orchestrator (`src/lib/create-project.ts`)

**Purpose**: Coordinates all modules to create a complete project

**Responsibilities**:
1. Validate project setup
2. Call installers in correct order
3. Generate all necessary files
4. Handle errors gracefully

**Structure**:
```typescript
export async function createProject(config: ProjectConfig) {
  // 1. Setup (logging, validation)
  // 2. Install tools (pnpm, Next.js)
  // 3. Install packages (Shadcn, deps)
  // 4. Generate files (config, landing page)
  // 5. Initialize git
}
```

**Key Principle**: The orchestrator should ONLY coordinate, not implement

## Data Flow

```
User Input (CLI)
      ↓
index.ts (Parse options)
      ↓
create-project.ts (Orchestrator)
      ↓
┌─────────────┬──────────────┬──────────────┐
│  Installers │  Generators  │     Git      │
└─────────────┴──────────────┴──────────────┘
      ↓
Complete MVP Project
```

## Adding New Features

### Example: Adding Docker Support

**1. Create Installer** (`src/lib/installers/install-docker.ts`):
```typescript
export async function installDocker(
  execOptions: { stdio?: 'inherit' },
  logger: Logger
): Promise<void> {
  // Docker installation logic
}
```

**2. Create Generator** (`src/lib/generators/docker-config.ts`):
```typescript
export async function generateDockerConfig(): Promise<void> {
  // Generate Dockerfile, docker-compose.yml
}
```

**3. Update Orchestrator** (`src/lib/create-project.ts`):
```typescript
import { installDocker } from './installers/install-docker.js';
import { generateDockerConfig } from './generators/docker-config.js';

export async function createProject(config: ProjectConfig) {
  // ... existing code ...
  
  if (config.includeDocker) {
    await installDocker(execOptions, logger);
    await generateDockerConfig();
  }
}
```

**4. Update Types** (`src/types.ts`):
```typescript
export interface ProjectConfig {
  // ... existing fields ...
  includeDocker: boolean;
}
```

**5. Update CLI** (`src/index.ts`):
```typescript
.option('--docker', 'Include Docker configuration')
```

## Best Practices

### File Size Guidelines

- **Utils**: < 50 lines per file
- **Installers**: < 100 lines per file
- **Generators**: < 200 lines per file
- **Orchestrator**: < 150 lines
- **If exceeded**: Split into smaller modules

### Naming Conventions

- **Installers**: `install-{tool}.ts`
- **Generators**: `generate-{feature}.ts` or `{feature}.ts`
- **Utils**: `{purpose}.ts` (e.g., `logger.ts`, `brand-name.ts`)

### Import Order

```typescript
// 1. Node.js built-ins
import fs from 'fs/promises';
import path from 'path';

// 2. External packages
import { execa } from 'execa';
import ora from 'ora';

// 3. Types
import type { ProjectConfig } from '../types.js';
import type { Logger } from '../utils/logger.js';

// 4. Internal utilities
import { createLogger } from '../utils/logger.js';

// 5. Internal modules
import { installPnpm } from './installers/install-pnpm.js';
```

### Error Handling

```typescript
// Critical operations: throw errors
export async function installPnpm(...) {
  try {
    // ...
  } catch (error) {
    spinner.fail('Failed to install pnpm');
    throw error; // Let orchestrator handle it
  }
}

// Optional operations: log warnings
export async function installBlocks(...) {
  try {
    // ...
  } catch (error) {
    spinner.warn('Some blocks failed to install');
    // Don't throw - continue execution
  }
}
```

## Testing Strategy

### Unit Tests (Per Module)
```typescript
// tests/utils/brand-name.test.ts
describe('projectNameToBrandName', () => {
  it('converts kebab-case to Title Case', () => {
    expect(projectNameToBrandName('my-app')).toBe('My App');
  });
});
```

### Integration Tests (Orchestrator)
```typescript
// tests/create-project.test.ts
describe('createProject', () => {
  it('creates a complete project', async () => {
    // Test full flow
  });
});
```

## Performance Considerations

1. **Parallel Operations**: Run independent operations concurrently
2. **Lazy Loading**: Only import modules when needed
3. **Streaming**: Use streams for large file operations
4. **Caching**: Cache expensive operations (e.g., npm queries)

## Maintenance Checklist

When modifying the codebase:

- [ ] Does new code follow single responsibility principle?
- [ ] Is the file under 200 lines?
- [ ] Are imports organized correctly?
- [ ] Is error handling appropriate?
- [ ] Are types properly defined?
- [ ] Is the module testable in isolation?
- [ ] Is documentation updated?

## Future Enhancements

Potential areas for expansion:

1. **Validators Module**: Input validation and sanitization
2. **Templates Module**: Multiple project templates
3. **Plugins System**: User-defined plugins
4. **Config System**: Configuration file support
5. **Update System**: Update existing projects

## Summary

This modular architecture provides:

- ✅ **Maintainability**: Easy to find and update code
- ✅ **Scalability**: Simple to add new features
- ✅ **Testability**: Each module tested independently
- ✅ **Readability**: Clear purpose for each file
- ✅ **Collaboration**: Multiple developers can work simultaneously

The 90% reduction in main file size (713 → 83 lines) demonstrates the power of modular design! 🚀
