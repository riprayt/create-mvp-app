import fs from 'fs/promises';
import type { ProjectConfig } from '../../types.js';

/**
 * Generates .cursorrules file with AI development guidelines and scalability best practices
 */
export async function generateCursorRules(config: ProjectConfig): Promise<void> {
  const cursorRules = `# AI Development Rules for ${config.projectName}

## Project Context
This is a Next.js 15 application built with the App Router, TypeScript, and Tailwind CSS.

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn UI
${config.includeAuth ? '- **Auth**: Clerk\n' : ''}${config.includeDb ? '- **Database**: Supabase (PostgreSQL)\n' : ''}${config.includeTests ? '- **Testing**: Vitest + Playwright\n' : ''}${config.includeCaching ? '- **Caching**: Upstash Redis\n' : ''}${config.includeBackgroundJobs ? '- **Background Jobs**: Inngest\n' : ''}${config.includeMonitoring ? '- **Monitoring**: Sentry\n' : ''}
## 🏗️ Scalable Architecture Guidelines

### File Size Limits (ENFORCE STRICTLY)
- **Components**: Max 200-300 lines
- **Functions**: Max 50 lines
- **Hooks**: Max 100 lines
- **Services**: Max 200 lines
- **If exceeded**: MUST extract into smaller modules

### Recommended Folder Structure

#### Feature-Based Organization (For Medium to Large Apps)
\`\`\`
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
├── shared/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Shared custom hooks
│   ├── utils/           # Utility functions
│   └── types/           # Shared TypeScript types
\`\`\`

#### Component Organization (Atomic Design)
\`\`\`
src/components/
├── ui/                  # Atoms (Button, Input, Label)
├── composed/            # Molecules (SearchBar, FormField)
├── features/            # Organisms (Navbar, UserCard)
└── layouts/             # Layout components
\`\`\`

### Service Layer Pattern (CRITICAL FOR SCALABILITY)

Always separate business logic from components:

\`\`\`typescript
// ❌ BAD: Logic mixed with component
export function UserProfile() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser);
  }, []);
  
  return <div>{user?.name}</div>;
}

// ✅ GOOD: Logic in service, component is clean
// src/lib/services/user-service.ts
export class UserService {
  static async getUser(id: string) {
    const res = await fetch(\`/api/user/\${id}\`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  }
}

// src/components/features/user/UserProfile.tsx
export function UserProfile() {
  const { data: user } = useSWR('user', () => UserService.getUser('123'));
  return <div>{user?.name}</div>;
}
\`\`\`

### Repository Pattern for Data Access

\`\`\`typescript
// src/lib/repositories/user-repository.ts
export class UserRepository {
  constructor(private supabase: SupabaseClient) {}
  
  async findById(id: string) {
    return this.supabase.from('users').select('*').eq('id', id).single();
  }
  
  async update(id: string, data: Partial<User>) {
    return this.supabase.from('users').update(data).eq('id', id);
  }
}

// src/lib/services/user-service.ts
export class UserService {
  constructor(private repo: UserRepository) {}
  
  async updateProfile(id: string, data: ProfileData) {
    // Business logic here
    const validated = await this.validateProfileData(data);
    return this.repo.update(id, validated);
  }
  
  private async validateProfileData(data: ProfileData) {
    // Validation logic
    return data;
  }
}
\`\`\`

### When to Create New Files/Modules

Create a new file when:
1. ✅ Component exceeds 200 lines
2. ✅ Logic is reused in 2+ places
3. ✅ Clear separation of concerns needed
4. ✅ Feature is self-contained
5. ✅ Testing needs isolation

### Route Organization (App Router)

\`\`\`
app/
├── (marketing)/         # Route group for marketing pages
│   ├── page.tsx
│   ├── about/
│   └── pricing/
├── (dashboard)/         # Route group for authenticated pages
│   ├── layout.tsx
│   ├── settings/
│   └── profile/
├── api/
│   └── [feature]/      # API routes by feature
│       └── route.ts
\`\`\`

## Code Style Rules

1. **Use Server Components by default**
   - Only add 'use client' when necessary (useState, useEffect, browser APIs, event handlers)
   - Fetch data in Server Components when possible

2. **File Naming**
   - Components: PascalCase (e.g., \`UserProfile.tsx\`)
   - Utilities: camelCase (e.g., \`formatDate.ts\`)
   - Pages/Routes: kebab-case (e.g., \`user-profile/page.tsx\`)

3. **Import Order**
   \`\`\`typescript
   // 1. React/Next imports
   import { useState } from 'react';
   import Image from 'next/image';
   
   // 2. External libraries
   import { clsx } from 'clsx';
   
   // 3. Internal components
   import { Button } from '@/components/ui/button';
   
   // 4. Internal utilities
   import { cn } from '@/lib/utils';
   
   // 5. Types
   import type { User } from '@/types';
   \`\`\`

4. **TypeScript**
   - Always define types/interfaces
   - Use \`type\` for unions, \`interface\` for objects
   - Avoid \`any\`, use \`unknown\` if needed

5. **Component Structure**
   \`\`\`typescript
   // Props interface first
   interface ComponentProps {
     title: string;
     onAction?: () => void;
   }
   
   // Component
   export function Component({ title, onAction }: ComponentProps) {
     // Hooks first
     const [state, setState] = useState();
     
     // Event handlers
     const handleClick = () => {};
     
     // Render
     return <div>...</div>;
   }
   \`\`\`

## Next.js Patterns

1. **Data Fetching**
   \`\`\`typescript
   // Server Component (preferred)
   async function Page() {
     const data = await fetch('...').then(r => r.json());
     return <div>{data}</div>;
   }
   
   // Client Component (when needed)
   'use client'
   function Page() {
     const { data } = useSWR('/api/data');
     return <div>{data}</div>;
   }
   \`\`\`

2. **Route Handlers**
   \`\`\`typescript
   // app/api/users/route.ts
   import { NextResponse } from 'next/server';
   
   export async function GET(request: Request) {
     const data = await fetchData();
     return NextResponse.json(data);
   }
   \`\`\`

3. **Metadata**
   \`\`\`typescript
   export const metadata = {
     title: 'Page Title',
     description: 'Page description',
   };
   \`\`\`

## Tailwind/Shadcn Patterns

1. **Use cn() utility for conditional classes**
   \`\`\`typescript
   import { cn } from '@/lib/utils';
   
   <div className={cn(
     "base-classes",
     variant === "primary" && "primary-classes",
     className
   )} />
   \`\`\`

2. **Shadcn Components**
   - Import from \`@/components/ui\`
   - Customize in place or wrap for project-specific logic
   - Use built-in variants when available

${config.includeAuth ? `## Authentication (Clerk)

1. **Protected Routes**
   \`\`\`typescript
   import { auth } from '@clerk/nextjs';
   
   export default async function ProtectedPage() {
     const { userId } = auth();
     if (!userId) redirect('/sign-in');
     // ...
   }
   \`\`\`

2. **Client Components**
   \`\`\`typescript
   'use client'
   import { useUser } from '@clerk/nextjs';
   
   export function UserProfile() {
     const { user } = useUser();
     return <div>{user?.firstName}</div>;
   }
   \`\`\`
` : ''}
${config.includeDb ? `## Database (Supabase)

1. **Server-side queries**
   \`\`\`typescript
   import { createClient } from '@/lib/supabase/server';
   
   export async function getData() {
     const supabase = createClient();
     const { data } = await supabase.from('table').select('*');
     return data;
   }
   \`\`\`

2. **Client-side queries**
   \`\`\`typescript
   'use client'
   import { createClient } from '@/lib/supabase/client';
   
   const supabase = createClient();
   const { data } = await supabase.from('table').select('*');
   \`\`\`
` : ''}
${config.includeCaching ? `## Caching (Redis)

1. **Rate Limiting**
   \`\`\`typescript
   import { ratelimit } from '@/lib/redis';
   
   const { success } = await ratelimit.limit(identifier);
   if (!success) return new Response('Too many requests', { status: 429 });
   \`\`\`

2. **Data Caching**
   \`\`\`typescript
   import { redis } from '@/lib/redis';
   
   const cached = await redis.get(key);
   if (cached) return cached;
   
   const data = await fetchData();
   await redis.set(key, data, { ex: 3600 });
   \`\`\`
` : ''}
## Performance & Scalability Best Practices

### Code Splitting
\`\`\`typescript
// Dynamic imports for heavy components
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false
});
\`\`\`

### Memoization
\`\`\`typescript
// Expensive computations
const expensiveValue = useMemo(() => computeExpensive(data), [data]);

// Callbacks
const handleClick = useCallback(() => doSomething(id), [id]);

// Components
const MemoizedComponent = memo(MyComponent);
\`\`\`

### General Performance
1. **Images**: Always use next/image
2. **Fonts**: Use next/font
3. **Dynamic imports**: For heavy components
4. **Streaming**: Use Suspense and loading.tsx
5. **Caching**: Use ISR and cache() for data fetching

## 📐 Scalability Checklist

Before adding new features, ask:
- [ ] Does this belong in a new module/file?
- [ ] Can I reuse existing utilities/services?
- [ ] Is the component/function small enough?
- [ ] Is business logic separated from UI?
- [ ] Are types properly defined?
- [ ] Is it testable in isolation?
- [ ] Will it affect bundle size?
- [ ] Is error handling comprehensive?

## 🚀 Application Growth Strategy

### Small App (< 10 pages)
- Simple structure in \`app/\` directory
- Components in \`src/components/\`
- Utils in \`src/lib/\`

### Medium App (10-50 pages)
- Route groups for organization
- Feature-based folders introduced
- Service layer for business logic
- Shared utilities extracted

### Large App (50+ pages)
- Full feature-based architecture
- Strict module boundaries
- Service and repository layers
- Consider monorepo structure

### When to Refactor (IMPORTANT!)

Refactor when:
- ⚠️ File exceeds 300 lines
- ⚠️ Function exceeds 50 lines
- ⚠️ Adding 4th similar feature → Extract pattern
- ⚠️ Copying code 3rd time → Create utility
- ⚠️ Props exceed 7 → Use composition or context
- ⚠️ Deep nesting (4+ levels) → Extract components

## Common Mistakes to Avoid

- ❌ Using 'use client' unnecessarily
- ❌ Fetching data in client components when server components would work
- ❌ Not using TypeScript types
- ❌ Ignoring ESLint warnings
- ❌ Not using Image component for images
- ❌ Hardcoding API URLs (use env variables)
- ❌ Creating files over 300 lines
- ❌ Mixing business logic with UI components
- ❌ Not extracting reusable code

## When to Ask for Clarification

- New external API integration
- Database schema changes
- Authentication flow modifications
- Major architectural decisions
- When considering breaking module boundaries

## Helpful Commands

\`\`\`bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm type-check   # Check TypeScript
${config.includeTests ? 'pnpm test        # Run tests\n' : ''}\`\`\`

---

**Remember**: 
- Keep files small and focused
- Separate concerns (UI, logic, data)
- Think modular and scalable from day one
- Refactor early and often
- Prioritize code quality and maintainability

**When in doubt, ask!**
`;
  
  await fs.writeFile('.cursorrules', cursorRules);
}
