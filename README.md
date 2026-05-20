# Career Path — Frontend (Rebuilt)

**Feature-based React + TypeScript SaaS application for career management**

---

## 🎯 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 📁 Project Structure

```
src/
├── app/                    # Application shell
│   ├── App.tsx            # Provider tree
│   ├── main.tsx           # Entry point
│   └── routes/
│       └── index.tsx      # Route definitions
│
├── features/              # Feature modules (domain-driven)
│   ├── auth/              # Authentication & authorization
│   ├── profile/           # User profiles
│   ├── jobs/              # Job board
│   ├── job-tracker/       # Personal application tracker
│   ├── posts/             # Community feed
│   ├── roadmaps/          # Learning paths
│   ├── ai/                # AI CV analysis & job matching
│   ├── interview/         # Interview prep
│   ├── company/           # Company dashboard
│   ├── admin/             # Admin panel
│   └── home/              # Landing page
│
├── shared/                # Shared across features
│   ├── components/        # Reusable UI (navigation, theme, primitives)
│   ├── hooks/             # Reusable hooks
│   └── types/             # Shared types
│
└── lib/                   # Core utilities
    ├── api/               # API client & error handling
    ├── env.ts             # Environment config
    ├── jwt.ts             # JWT utilities
    ├── queryClient.ts     # TanStack Query config
    └── utils.ts           # Helpers (cn, etc.)
```

---

## 🧩 Feature Module Pattern

Each feature follows this structure:

```
features/[feature]/
├── components/     # Feature-specific UI
├── hooks/          # Feature hooks (queries, mutations)
├── services/       # API calls
├── schemas/        # Zod validation schemas
├── types/          # TypeScript types
├── pages/          # Route pages
└── index.ts        # Public API (barrel export)
```

**Benefits:**
- **Co-location:** Everything for a feature lives together
- **Encapsulation:** Features are self-contained modules
- **Scalability:** Add new features by copying the pattern
- **Testability:** Each feature can be tested in isolation

---

## 🔑 Key Technologies

- **React 19** — UI library
- **TypeScript** — Type safety
- **Vite** — Build tool
- **TanStack Query v5** — Server state management
- **React Hook Form + Zod** — Forms & validation
- **Axios** — HTTP client with interceptors
- **Tailwind CSS v4** — Styling
- **shadcn/ui** — Accessible component primitives
- **React Router v7** — Client-side routing
- **Sonner** — Toast notifications

---

## 🛡️ Architecture Decisions

### State Management
- **Server state:** TanStack Query (all API data)
- **Auth state:** React Context + localStorage + TanStack Query
- **Local UI state:** useState/useReducer (component-local)
- **No Zustand:** All global state fits in React Context

### API Layer
- **Single axios instance** with auth interceptor
- **Token refresh queue** prevents concurrent 401 storms
- **Typed error classes** for consistent error handling
- **Zod validation** at every API boundary

### Forms
- **React Hook Form** for all forms
- **Zod schemas** for validation
- **Reusable form components** (FormInput, FormSelect, etc.)
- **Server error mapping** to form fields

### Routing
- **No lazy loading yet** (can be added incrementally)
- **AuthGuard pattern** can be added (currently AppLayout shows public header)
- **Error boundaries** can be added per route

---

## 🔄 Import Conventions

Use absolute imports with `@/` prefix:

```typescript
// ✅ Good
import { useAuth } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";
import { apiClient } from "@/lib/api";

// ❌ Avoid
import { useAuth } from "../../../features/auth/hooks/useAuth";
```

---

## 🧪 Testing Strategy (Future)

Recommended setup:

```
features/[feature]/
├── __tests__/
│   ├── hooks/
│   ├── components/
│   └── services/
```

**Stack:**
- Vitest (test runner)
- Testing Library (component tests)
- MSW (API mocking)

---

## 🚀 Deployment

```bash
# Build
npm run build

# Preview build locally
npm run preview
```

**Environment Variables:**
- `VITE_API_BASE_URL` — Backend API URL (includes /api)
- `VITE_APP_NAME` — Application name
- `VITE_APP_VERSION` — Version string

---

## 📚 Documentation

- **MIGRATION.md** — Complete migration guide from old structure
- **Phase 2 Plan** — Architecture decisions and folder structure
- **Risk Log** — Known issues requiring developer review

---

## 🐛 Known Issues

See **MIGRATION.md Risk Log** for:
- No AuthGuard redirect (AppLayout shows public header instead)
- Unrouted pages (SettingsPage, UsersListPage, etc.)
- Empty constants.ts file
- Double /api/ prefix in userService

---

## 🎨 Code Style

- **Components:** PascalCase (`ProfilePage.tsx`)
- **Hooks:** camelCase starting with `use` (`useProfile.ts`)
- **Constants:** UPPER_SNAKE_CASE
- **Files:** kebab-case for folders, PascalCase for components
- **Max file length:** 200 lines (soft limit)

---

## 🤝 Contributing

1. Follow the feature module pattern
2. Add Zod schemas for all API boundaries
3. Use TanStack Query for all server state
4. Keep components under 200 lines
5. Write tests for critical paths

---

## 📄 License

[Your License Here]
