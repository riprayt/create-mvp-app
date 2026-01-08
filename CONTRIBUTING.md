# 🛠️ Contributing to Create MVP App

Guide for developing and contributing to the create-mvp-app CLI tool.

## 🚀 Quick Setup

```bash
# Clone the repo
git clone https://github.com/riprayt/create-mvp-app
cd create-mvp-app

# Install dependencies
pnpm install

# Build the project
pnpm build

# Link for local testing
pnpm link --global

# Now you can test it
create-mvp-app test-project
```

## 📁 Project Structure

```
create-mvp-app/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── types.ts              # TypeScript types
│   └── lib/
│       └── create-project.ts # Main project creation logic
├── dist/                     # Compiled output (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Development Workflow

### 1. Make Changes

Edit files in `src/`:
- `src/index.ts` - CLI interface, prompts, options
- `src/lib/create-project.ts` - Project scaffolding logic
- `src/types.ts` - Type definitions

### 2. Build

```bash
pnpm build
```

Or watch mode for development:

```bash
pnpm dev
```

### 3. Test Locally

```bash
# Method 1: Using linked command
create-mvp-app test-project

# Method 2: Direct execution
node dist/index.js test-project

# Method 3: Using pnpm start
pnpm start test-project

# With debug mode
create-mvp-app test-project --debug
```

### 4. Test All Scenarios

```bash
# Quick mode
create-mvp-app test1 --yes

# Minimal setup
create-mvp-app test2 --no-auth --no-db --no-blocks --no-tests

# With production features (select in prompt)
create-mvp-app test3

# Debug mode
create-mvp-app test4 --debug
```

## 🧪 Testing Checklist

Before submitting a PR, test these scenarios:

- [ ] Interactive mode with all features
- [ ] Quick mode (`--yes`)
- [ ] Minimal setup (all `--no-*` flags)
- [ ] With environment variables
- [ ] Debug mode (`--debug`)
- [ ] Invalid project name
- [ ] Existing directory (should fail gracefully)
- [ ] Cancelled prompts (Ctrl+C)
- [ ] Opening in Cursor (`--open`)

## 📝 Code Style

### TypeScript

- Use TypeScript strict mode
- Export types from `types.ts`
- Prefer async/await over promises
- Use descriptive variable names

### Formatting

```bash
# Auto-format on commit (husky + lint-staged)
git commit -m "feat: add new feature"
```

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add background jobs support
fix: resolve git commit issues
docs: update README
chore: update dependencies
```

## 🏗️ Architecture

### CLI Flow

```
index.ts
  ├─ Parse arguments (commander)
  ├─ Prompt user (prompts)
  ├─ Build config (ProjectConfig)
  └─ Call createProject()
      └─ create-project.ts
          ├─ Install pnpm
          ├─ Create Next.js app
          ├─ Install Shadcn UI
          ├─ Install dependencies
          ├─ Install production features
          ├─ Install Shadcn Blocks
          ├─ Create config files
          │   ├─ .cursorrules
          │   ├─ .vscode/settings.json
          │   ├─ .env.local
          │   └─ lib files
          ├─ Initialize Git
          └─ Open in Cursor (optional)
```

### Adding New Features

1. **Update types** (`src/types.ts`):
```typescript
export interface ProjectConfig {
  // ... existing fields
  includeNewFeature: boolean;
}
```

2. **Add CLI option** (`src/index.ts`):
```typescript
.option('--new-feature', 'Enable new feature')
```

3. **Add prompt** (`src/index.ts`):
```typescript
{
  type: 'multiselect',
  name: 'productionFeatures',
  choices: [
    // ... existing
    { title: 'New Feature', value: 'newfeature', selected: true },
  ],
}
```

4. **Install dependencies** (`src/lib/create-project.ts`):
```typescript
if (config.includeNewFeature) {
  deps.push('new-feature-package');
  log('Adding new feature');
}
```

5. **Create config files** (`src/lib/create-project.ts`):
```typescript
if (config.includeNewFeature) {
  const featureConfig = `// Feature config`;
  await fs.writeFile('src/lib/newfeature.ts', featureConfig);
}
```

6. **Update documentation** (`FEATURES.md`, `README.md`)

## 🎯 Key Files to Know

### `src/index.ts`

- CLI interface using `commander`
- User prompts using `prompts`
- Config building
- Post-creation messages

**Important sections:**
- Command options (lines ~15-30)
- Interactive prompts (lines ~70-130)
- Config creation (lines ~200-240)

### `src/lib/create-project.ts`

- Main project creation logic
- Dependency installation
- File generation
- Git initialization

**Important sections:**
- Dependency installation (lines ~85-140)
- Config file creation (lines ~240-300)

### `src/types.ts`

- TypeScript interfaces
- Ensures type safety across the project

## 🐛 Debugging

### Enable Debug Mode

```bash
create-mvp-app test-app --debug
```

This shows:
- All executed commands
- File paths
- Configuration object
- Error stack traces

### Add Debug Logs

```typescript
const log = (message: string) => {
  if (debugMode) {
    console.log(chalk.gray(`[DEBUG] ${message}`));
  }
};

log('Your debug message here');
```

### Common Issues

**"Command not found" after linking:**
```bash
# Unlink and relink
pnpm unlink --global
pnpm link --global
```

**Changes not reflected:**
```bash
# Rebuild
pnpm build

# Relink if needed
pnpm unlink --global && pnpm link --global
```

**TypeScript errors:**
```bash
# Check types
pnpm tsc --noEmit
```

## 📦 Publishing (Maintainers Only)

### Pre-publish Checklist

- [ ] All tests pass
- [ ] Version bumped in `package.json`
- [ ] CHANGELOG.md updated
- [ ] README.md updated
- [ ] Tested locally with `pnpm link`
- [ ] Git committed and pushed

### Publish to npm

```bash
# Build
pnpm build

# Test the package
npm pack
tar -xvzf create-mvp-app-*.tgz
cd package && npm link

# Publish
npm publish
```

### Versioning

Follow [Semantic Versioning](https://semver.org/):

- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features (backward compatible)
- **Patch** (0.0.1): Bug fixes

```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

## 🤝 Pull Request Process

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit (`git commit -m 'feat: add amazing feature'`)
6. Push (`git push origin feat/amazing-feature`)
7. Open a Pull Request

### PR Guidelines

- Clear title and description
- Link related issues
- Include before/after examples
- Add tests if applicable
- Update documentation

## 📚 Resources

- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Prompts](https://github.com/terkelg/prompts) - Interactive prompts
- [Chalk](https://github.com/chalk/chalk) - Terminal colors
- [Ora](https://github.com/sindresorhus/ora) - Spinners
- [Execa](https://github.com/sindresorhus/execa) - Process execution

## 💬 Questions?

Open an issue or discussion on GitHub!

## 📄 License

MIT © [Create MVP App](LICENSE)
