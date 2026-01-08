# 📚 Features & Documentation

Complete guide to all features available in Create MVP App.

## 🎯 Core Features

### 🤖 AI Development Bundle
- **Auto-generated `.cursorrules`** - AI coding instructions optimized for your project with comprehensive scalability guidelines
- **VS Code settings** - Pre-configured for AI-assisted development
- **Type-safe** - Full TypeScript support with strict mode
- **AI-friendly structure** - Clear file organization for better AI understanding
- **Scalability Best Practices** - Built-in guidelines for modular, maintainable code

### 🏗️ Scalable Architecture (NEW!)
- **File Size Guidelines** - Enforces max 200-300 line files
- **Service Layer Pattern** - Separates business logic from UI
- **Repository Pattern** - Data access layer for clean database queries
- **Feature-Based Organization** - Scales from small to large applications
- **Modular Design** - Each module has single responsibility
- **When to Refactor Guide** - Clear signals for code improvement
- **Growth Strategy** - Patterns for small, medium, and large apps

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for implementation details**

### 🔐 Authentication (Clerk)
- Social logins (Google, GitHub, etc.)
- Email/Password authentication
- Multi-factor authentication (MFA)
- User management dashboard
- Session management
- Webhook support

### 💾 Database (Supabase)
- PostgreSQL database
- Real-time subscriptions
- Row-level security
- Database migrations
- Storage for files
- Edge functions

### 🎨 UI Components (Shadcn)
- **Base Components**: 40+ production-ready components
- **Shadcn Blocks**: 90+ copy-paste sections
- Dark mode support
- Fully customizable with Tailwind CSS
- Accessible (ARIA compliant)
- Responsive by default

### 🏠 Landing Page
- **Pre-built Landing Page** - Beautiful, production-ready landing page that **explains what create-mvp-app is**
- **Informative Content** - Showcases the features, components, and tech stack included in your project
- **Dynamic Branding** - Brand name automatically generated from project name
- **Complete Sections**:
  - Responsive Navbar with navigation menu
  - Hero section explaining create-mvp-app
  - Features overview (what's included)
  - Components showcase (90+ Shadcn Blocks)
  - Tech stack section
  - Testimonials section
  - Call-to-action with documentation links
  - Footer with useful resources and tools
- **Developer-Friendly** - Helps you understand your starter template
- **Customizable** - Easily modify for your own app after reviewing
- **Mobile-first** - Fully responsive design
- **Files Created**:
  - `src/app/page.tsx` - Landing page with branded components and create-mvp-app information

**Brand Name Generation Examples**:
- `my-awesome-app` → `My Awesome App`
- `todo-list` → `Todo List`
- `e-commerce-store` → `E Commerce Store`
- `saas-starter` → `Saas Starter`
- `portfolio-website` → `Portfolio Website`

**Landing Page Purpose**:
The landing page serves as an **informative welcome** that:
- Explains what create-mvp-app provides
- Demonstrates included components
- Links to documentation and resources
- Shows the tech stack and tools
- Provides a starting point for customization

The brand name is automatically used throughout the landing page in:
- Navbar logo title
- Hero section welcome message
- Footer branding
- Page metadata

### 🧪 Testing
- **Unit Tests**: Vitest for component and logic testing
- **E2E Tests**: Playwright for end-to-end testing
- Pre-configured test scripts
- Coverage reporting

## 🚀 Production Features

### 🗄️ Caching Layer (Upstash Redis)
- Redis client pre-configured
- Rate limiting built-in
- Session caching ready
- API response caching
- **Files Created**:
  - `src/lib/redis.ts` - Redis client & rate limiter

### ⚙️ Background Jobs (Inngest)
- Event-driven background processing
- Automatic retries
- Step functions
- Cron jobs support
- **Files Created**:
  - `src/lib/inngest.ts` - Inngest client
  - `src/app/api/inngest/route.ts` - Inngest webhook endpoint

### 🔗 Webhooks (Svix)
- Webhook delivery management
- Signature verification
- Automatic retries
- Webhook dashboard
- **Integration ready** for Clerk, Stripe, etc.

### 🏢 Multi-tenancy
- Tenant isolation patterns
- Database schema templates
- Middleware for tenant context
- Row-level security examples

### 🚩 Feature Flags (Vercel Flags)
- Toggle features without deployment
- A/B testing ready
- Progressive rollouts
- Environment-based flags

### 🧪 A/B Testing (Vercel Edge Config)
- Edge-based experiments
- Real-time config updates
- No build required for changes
- Analytics integration

### 📊 Monitoring (Sentry)
- Error tracking
- Performance monitoring
- Release tracking
- Source maps configured
- **Files Created**:
  - `sentry.client.config.ts`
  - `sentry.server.config.ts`
  - `sentry.edge.config.ts`

### 📈 Analytics (Vercel)
- User analytics
- Page views tracking
- Custom events
- Speed insights
- Real user monitoring

## 🛠️ CLI Options

### Basic Usage

```bash
npx create-mvp-app [project-name] [options]
```

### All Flags

| Flag | Description | Default |
|------|-------------|---------|
| `[project-name]` | Project name (kebab-case) | Interactive prompt |
| `-y, --yes` | Skip prompts, use defaults | `false` |
| `-d, --debug` | Show detailed logs | `false` |
| `--no-auth` | Skip Clerk authentication | `true` |
| `--no-db` | Skip Supabase database | `true` |
| `--no-ui` | Skip Shadcn UI components | `true` |
| `--no-blocks` | Skip Shadcn Blocks | `true` |
| `--no-tests` | Skip testing setup | `true` |
| `--no-git` | Skip git initialization | `true` |
| `--open` | Open in Cursor after creation | `false` |
| `--clerk-key <key>` | Clerk publishable key | - |
| `--clerk-secret <secret>` | Clerk secret key | - |
| `--supabase-url <url>` | Supabase project URL | - |
| `--supabase-key <key>` | Supabase anon key | - |

### Examples

```bash
# Full featured app (recommended)
npx create-mvp-app my-saas --yes

# Minimal app (just Next.js + UI)
npx create-mvp-app my-app --no-auth --no-db --no-tests --no-blocks

# SaaS without pre-built blocks
npx create-mvp-app my-saas --no-blocks

# Landing page
npx create-mvp-app landing --no-auth --no-db

# With API keys
npx create-mvp-app my-app \
  --clerk-key pk_test_xxx \
  --clerk-secret sk_test_xxx \
  --supabase-url https://xxx.supabase.co \
  --supabase-key your-anon-key

# Debug mode
npx create-mvp-app my-app --debug

# Open in Cursor automatically
npx create-mvp-app my-app --open
```

## 📁 Generated Structure

```
my-mvp-app/
├── .cursorrules              # AI coding instructions
├── .vscode/                  # VS Code settings
│   └── settings.json
├── src/
│   ├── app/                  # Next.js app router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/              # API routes
│   ├── components/           # UI components
│   │   └── ui/               # Shadcn components
│   ├── lib/                  # Utilities
│   │   ├── redis.ts          # Redis client (if selected)
│   │   └── inngest.ts        # Inngest client (if selected)
│   └── hooks/                # Custom React hooks
├── public/                   # Static assets
├── tests/                    # Test files
├── .env.local                # Environment variables
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 🔧 Post-Setup Steps

### 1. Configure Environment Variables

Edit `.env.local` with your actual API keys:

```bash
# Clerk (if selected)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-key
CLERK_SECRET_KEY=your-secret

# Supabase (if selected)
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# Production features (if selected)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-token
SENTRY_DSN=your-sentry-dsn
```

### 2. Start Development

```bash
cd my-mvp-app
pnpm dev
```

### 3. Run Tests

```bash
pnpm test          # Unit tests
pnpm test:e2e      # E2E tests
pnpm test:coverage # Coverage report
```

### 4. Deploy to Vercel

```bash
pnpm vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com).

## 🎨 Customization

### Tailwind Config

Edit `tailwind.config.ts` for custom colors, fonts, etc.

### Components

All Shadcn components are in `src/components/ui/` and fully customizable.

### AI Instructions

Edit `.cursorrules` to customize AI behavior for your project.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Production Tips](./PRODUCTION-TIPS.md)

## 🆘 Troubleshooting

### Common Issues

**Installation fails:**
```bash
# Try with debug mode
npx create-mvp-app my-app --debug
```

**Cursor command not found:**
```bash
# Install Cursor CLI
# In Cursor: Cmd+Shift+P → "Install 'cursor' command"
```

**Dependencies won't install:**
```bash
# Clear cache and try again
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**TypeScript errors:**
```bash
# Restart TypeScript server
# In VS Code/Cursor: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup.

## 📄 License

MIT © [Create MVP App](LICENSE)
