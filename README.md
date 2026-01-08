# Create MVP App

🚀 A powerful CLI tool to scaffold production-ready Next.js MVPs in minutes. Get your SaaS up and running with authentication, database, and 90+ UI components out of the box.

[![npm version](https://img.shields.io/npm/v/create-mvp-app.svg)](https://www.npmjs.com/package/create-mvp-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🎯 Why Create MVP App?

- ⏱️ **5-Minute Setup** → Production-ready app
- 🚀 **Deploy in < 3 Minutes** → Vercel-optimized out of the box
- 🔋 **Batteries Included** → Auth, DB, UI, Testing - all configured
- 📈 **90+ Score** → Lighthouse performance by default
- 🎨 **90+ Components** → Copy-paste ready UI blocks
- 🔐 **Enterprise Security** → Security headers and best practices pre-configured
- ⚡ **Zero Config** → Just run, deploy, ship

**From idea to production in < 10 minutes.** Seriously.

## ✨ Features

- 🎨 **Interactive CLI** - Beautiful prompts with multi-select options
- ⚡️ **Quick Mode** - Skip prompts with command-line flags
- 🔐 **Authentication** - Clerk integration with social logins & MFA
- 💾 **Database** - Supabase (PostgreSQL) with real-time capabilities
- 🎭 **90+ UI Components** - Shadcn Blocks ready to use
- 🧪 **Testing Setup** - Vitest + Playwright pre-configured
- 🛠️ **Modern Tooling** - pnpm, TypeScript, ESLint, Prettier, Husky
- 🐛 **Debug Mode** - Detailed logs for troubleshooting
- 📦 **Zero Config** - Works out of the box
- 🚀 **Production-Ready** - Vercel-optimized with security headers
- ⚡ **Performance** - Optimized images (AVIF/WebP), CSS, and bundle size
- 🔒 **Security First** - Security headers, CSP, and best practices built-in

## 🚀 Quick Start

### Using npx (Recommended)

```bash
npx create-mvp-app
```

### Using npm

```bash
npm install -g create-mvp-app
create-mvp-app
```

### Using pnpm

```bash
pnpm dlx create-mvp-app
```

## 📖 Usage

### Interactive Mode

Launch the CLI and answer the prompts:

```bash
npx create-mvp-app
```

You'll be asked to:
- ✅ Name your project
- ✅ Select features (Auth, Database, UI Components, Tests)
- ✅ Provide environment variables (optional)
- ✅ Initialize Git repository

### Quick Mode

Skip all prompts and use defaults:

```bash
npx create-mvp-app my-project --yes
```

### Custom Setup

Pick and choose features:

```bash
# Minimal setup (no auth, no database)
npx create-mvp-app simple-app --no-auth --no-db --no-blocks --no-tests

# SaaS with auth but no blocks
npx create-mvp-app my-saas --no-blocks

# Landing page only
npx create-mvp-app landing --no-auth --no-db --no-tests
```

### With Environment Variables

Provide your API keys during setup:

```bash
npx create-mvp-app my-app \
  --clerk-key pk_test_xxx \
  --clerk-secret sk_test_xxx \
  --supabase-url https://xxx.supabase.co \
  --supabase-key your-anon-key
```

### Debug Mode

See detailed logs and command output:

```bash
npx create-mvp-app my-app --debug
```

## 🎯 CLI Options

| Flag | Description |
|------|-------------|
| `[project-name]` | Name of your project (kebab-case) |
| `-y, --yes` | Skip prompts and use defaults |
| `-d, --debug` | Show detailed logs and command output |
| `--no-auth` | Skip authentication (Clerk) setup |
| `--no-db` | Skip database (Supabase) setup |
| `--no-ui` | Skip Shadcn UI components |
| `--no-blocks` | Skip Shadcn Blocks (90+ components) |
| `--no-tests` | Skip testing setup (Vitest + Playwright) |
| `--no-git` | Skip git initialization |
| `--clerk-key <key>` | Clerk publishable key |
| `--clerk-secret <secret>` | Clerk secret key |
| `--supabase-url <url>` | Supabase project URL |
| `--supabase-key <key>` | Supabase anon key |
| `-h, --help` | Display help information |
| `-V, --version` | Display version number |

## 📦 What's Included

### Core Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Code Quality**: ESLint + Prettier + Husky

### Optional Features

#### 🔐 Authentication (Clerk)
- Social logins (Google, GitHub, etc.)
- Multi-factor authentication
- User management
- Session handling
- Protected routes

#### 💾 Database (Supabase)
- PostgreSQL database
- Real-time subscriptions
- File storage
- Row-level security
- Type-safe client

#### 🎨 UI Components
- Shadcn UI base components
- 90+ pre-built Shadcn Blocks
- Dark mode support
- Responsive design
- Accessible components

#### 🧪 Testing
- Vitest for unit tests
- Playwright for E2E tests
- Testing Library
- Example test files

### Project Structure

```
your-project/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Protected pages
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── ui/               # Shadcn UI components
│   │   ├── auth/             # Auth components
│   │   └── layout/           # Layout components
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client
│   │   ├── utils.ts          # Utility functions
│   │   └── api-utils.ts      # API helpers
│   └── env.ts                # Environment validation
├── e2e/                      # E2E tests
├── public/                   # Static assets
├── .env.local                # Environment variables
└── package.json
```

## 🎬 After Installation

1. **Navigate to your project**:
   ```bash
   cd your-project
   ```

2. **Add environment variables** (if not provided during setup):
   - Edit `.env.local` (copy from `.env.example`)
   - Add your Clerk keys from [dashboard.clerk.com](https://dashboard.clerk.com)
   - Add your Supabase keys from [supabase.com/dashboard](https://supabase.com/dashboard)

3. **Start development server**:
   ```bash
   pnpm dev
   ```

4. **Open your browser**:
   ```
   http://localhost:3000
   ```

## 🚀 Deploy to Production

### One-Click Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Vercel auto-detects Next.js settings

3. **Add Environment Variables**:
   - In Vercel dashboard → Settings → Environment Variables
   - Add all variables from `.env.example`:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (if using server-side operations)
     - `NEXT_PUBLIC_APP_URL` (your Vercel URL)

4. **Deploy**:
   - Click "Deploy"
   - Your app will be live in 2-3 minutes!

### Production Checklist

Before going live, ensure:

- ✅ **Environment Variables**: All production keys are set in Vercel
- ✅ **Clerk Setup**: Add production domain in Clerk dashboard
- ✅ **Supabase**: Enable RLS policies for security
- ✅ **Domain**: Configure custom domain in Vercel
- ✅ **Analytics**: Add Vercel Analytics (automatic) or your preferred tool
- ✅ **Error Monitoring**: Set up Sentry or similar (optional)
- ✅ **Performance**: Test with Lighthouse (aim for 90+ score)
- ✅ **Security Headers**: Pre-configured in `vercel.json`
- ✅ **Image Optimization**: Using Next.js Image with AVIF/WebP
- ✅ **SEO**: Update metadata in `layout.tsx` and `page.tsx`

### Alternative Deployment Options

#### Vercel CLI

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Docker (Self-Hosted)

```bash
# Build container
docker build -t my-mvp-app .

# Run container
docker run -p 3000:3000 my-mvp-app
```

#### Other Platforms

- **Netlify**: Works with Next.js adapter
- **Railway**: Import from GitHub
- **Fly.io**: Deploy with Dockerfile
- **AWS Amplify**: Connect to GitHub repo

### Post-Deployment

1. **Test your production app**:
   - Sign up flow
   - Authentication
   - Database operations
   - All critical user flows

2. **Monitor performance**:
   - Vercel Analytics dashboard
   - Check Web Vitals scores
   - Monitor error rates

3. **Set up CI/CD** (automatic with Vercel):
   - Every push to `main` → Production
   - Pull requests → Preview deployments
   - Optional: Add GitHub Actions for tests

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |
| `pnpm type-check` | Check TypeScript types |
| `pnpm format` | Format code with Prettier |
| `pnpm lint` | Lint code with ESLint |

## 🎓 Examples

### Minimal Blog

```bash
npx create-mvp-app my-blog \
  --no-auth \
  --no-db \
  --no-tests
```

### Full SaaS Application

```bash
npx create-mvp-app my-saas \
  --yes \
  --clerk-key pk_live_xxx \
  --clerk-secret sk_live_xxx \
  --supabase-url https://xxx.supabase.co \
  --supabase-key your-key
```

### E-commerce Store

```bash
npx create-mvp-app my-store --yes
```

### Landing Page with Form

```bash
npx create-mvp-app landing \
  --no-auth \
  --no-blocks \
  --no-tests
```

## ⚡ Performance & Optimization Tips

### Ship Faster to Production

1. **Use Quick Mode** for instant scaffolding:
   ```bash
   npx create-mvp-app my-app --yes
   ```

2. **Start Minimal, Add Later**:
   ```bash
   # Start with just UI
   npx create-mvp-app mvp --no-auth --no-db --no-tests
   
   # Add features incrementally as needed
   ```

3. **Production Optimization Built-in**:
   - ✅ Image optimization (AVIF/WebP)
   - ✅ CSS optimization
   - ✅ Bundle size optimization
   - ✅ Security headers
   - ✅ Compression enabled
   - ✅ Cache strategies configured

### What's Pre-Optimized

| Feature | Configuration | Benefit |
|---------|--------------|---------|
| **Images** | AVIF/WebP formats | 30-50% smaller files |
| **Caching** | Smart cache headers | Faster page loads |
| **Security** | CSP, HSTS, X-Frame-Options | Protected by default |
| **Bundle** | Tree shaking, code splitting | Smaller JavaScript |
| **CSS** | Tailwind JIT, purging | Minimal CSS size |
| **Fonts** | Next.js font optimization | No layout shift |
| **Compression** | Gzip/Brotli | 70% smaller transfers |

### Speed Recommendations

1. **Remove unused components**: Delete components from `src/components/` you don't use
2. **Lazy load heavy components**: Use `dynamic()` for heavy UI
3. **Optimize imports**: Import specific components, not entire libraries
4. **Use React Server Components**: Default in App Router - keep using them!
5. **Add ISR or SSG**: For static content, use `export const revalidate = 3600`

### Build for Production

```bash
# Analyze bundle size
ANALYZE=true pnpm build

# Build and check size
pnpm build
# Look for any bundles > 200KB

# Test production build locally
pnpm build && pnpm start
```

## 🐛 Troubleshooting

### Debug Mode

Run with `--debug` to see detailed logs:

```bash
npx create-mvp-app my-app --debug
```

### Common Issues

**Issue**: `Directory already exists`
- **Solution**: Choose a different project name or delete the existing directory

**Issue**: `Permission denied`
- **Solution**: Run with appropriate permissions or check directory access

**Issue**: `Command not found`
- **Solution**: Make sure Node.js and npm/pnpm are installed

**Issue**: `Blocks installation fails`
- **Solution**: This is normal for some blocks. The app still works without them.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Clerk](https://clerk.com/) - Authentication
- [Supabase](https://supabase.com/) - Database
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Shadcn Blocks](https://shadcnblocks.com/) - Component blocks

## 📞 Support

- 🐛 [Report a Bug](https://github.com/yourusername/create-mvp-app/issues)
- 💡 [Request a Feature](https://github.com/yourusername/create-mvp-app/issues)
- 📖 [Documentation](https://github.com/yourusername/create-mvp-app#readme)

## 📚 Additional Documentation

- 📖 [QUICKSTART.md](QUICKSTART.md) - Quick reference guide
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- ⚡ [PRODUCTION-TIPS.md](PRODUCTION-TIPS.md) - Speed & optimization tips
- 📋 [CONFIGURATION-SUMMARY.md](CONFIGURATION-SUMMARY.md) - What's pre-configured

---

Made with ❤️ by developers, for developers

**Ship your MVP in < 10 minutes!** 🚀
