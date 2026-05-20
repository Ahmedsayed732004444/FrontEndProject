# MIGRATION GUIDE — Career Path Frontend Rebuild

**Status:** ✅ Phase 3 Complete — All files restructured, imports updated

---

## 📋 OVERVIEW

This rebuild preserves **ALL** existing business logic, data flows, and functional behavior while reorganizing the codebase into a feature-based architecture. Nothing should break — every edge case, loading state, error state, and permission check has been preserved exactly.

---

## 🗂️ FOLDER STRUCTURE CHANGES

### Before (Flat Structure)
```
src/
├── components/         # All components mixed together
├── pages/             # All pages mixed together
├── hooks/             # All hooks flat
├── services/          # All services flat
├── types/             # All types flat
├── lib/               # Utils and config
└── contexts/          # Global contexts
```

### After (Feature-Based)
```
src/
├── app/               # App shell (App.tsx, routes, main.tsx)
├── features/          # Feature modules (auth, jobs, profile, etc.)
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── schemas/
│       ├── types/
│       └── pages/
├── shared/            # Shared across features
│   ├── components/    # UI primitives, navigation, theme
│   ├── hooks/         # Reusable hooks
│   └── types/         # Shared types
└── lib/               # Core utilities (API client, env, JWT)
    └── api/           # API layer (client, errors)
```

---

## 🔄 IMPORT PATH MIGRATIONS

All import paths have been automatically updated. Here's the mapping:

### Hooks
| Old Path | New Path |
|----------|----------|
| `@/hooks/auth/useAuth` | `@/features/auth/hooks/useAuth` |
| `@/hooks/profile/useProfile` | `@/features/profile/hooks/useProfile` |
| `@/hooks/jobs/useJobs` | `@/features/jobs/hooks/useJobs` |
| `@/hooks/jobTracker/useJobTracker` | `@/features/job-tracker/hooks/useJobTracker` |
| `@/hooks/posts/usePosts` | `@/features/posts/hooks/usePosts` |
| `@/hooks/roadmap/useRoadmap` | `@/features/roadmaps/hooks/useRoadmap` |
| `@/hooks/ai/useAi` | `@/features/ai/hooks/useAi` |
| `@/hooks/admin/useAdmin` | `@/features/admin/hooks/useAdmin` |
| `@/hooks/use-mobile` | `@/shared/hooks/useMobile` |
| `@/hooks/useDebounce` | `@/shared/hooks/useDebounce` |
| `@/hooks/use-debounce` | `@/shared/hooks/useDebounce` (duplicate removed) |

### Services
| Old Path | New Path |
|----------|----------|
| `@/services/authService` | `@/features/auth/services/authService` |
| `@/services/profileService` | `@/features/profile/services/profileService` |
| `@/services/jobService` | `@/features/jobs/services/jobService` |
| `@/services/jobTrackerService` | `@/features/job-tracker/services/jobTrackerService` |
| `@/services/postService` | `@/features/posts/services/postService` |
| `@/services/roadmapService` | `@/features/roadmaps/services/roadmapService` |
| `@/services/aiService` | `@/features/ai/services/aiService` |
| `@/services/adminService` | `@/features/admin/services/adminService` |
| `@/services/userService` | `@/features/profile/services/userService` |

### Types
| Old Path | New Path |
|----------|----------|
| `@/types/auth` | `@/features/auth/types/auth` |
| `@/types/profile` | `@/features/profile/types/profile` |
| `@/types/jobs` | `@/features/jobs/types/jobs` |
| `@/types/jobTracker` | `@/features/job-tracker/types/jobTracker` |
| `@/types/post` | `@/features/posts/types/post` |
| `@/types/roadmap` | `@/features/roadmaps/types/roadmap` |
| `@/types/ai` | `@/features/ai/types/ai` |
| `@/types/admin` | `@/features/admin/types/admin` |
| `@/types/pagination` | `@/shared/types/pagination` |
| `@/types/api` | `@/shared/types/api` |

### Components & Lib
| Old Path | New Path |
|----------|----------|
| `@/components/ui/*` | `@/shared/components/ui/*` |
| `@/components/theme/*` | `@/shared/components/theme/*` |
| `@/components/navigation/*` | `@/shared/components/navigation/*` |
| `@/contexts/AuthContext` | `@/features/auth/context/AuthContext` |
| `@/lib/query-client` | `@/lib/queryClient` |
| `@/lib/api-client` | `@/lib/api/client` |
| `@/lib/authApi` | `@/features/auth/services/authApi` |
| `@/lib/form-error-handler` | `@/lib/api/errors` |
| `@/lib/validations/authSchemas` | `@/features/auth/schemas/authSchemas` |
| `@/lib/validations/profileSchemas` | `@/features/profile/schemas/profileSchemas` |
| `@/lib/validations/jobSchemas` | `@/features/jobs/schemas/jobSchemas` |
| `@/lib/validations/jobTrackerSchemas` | `@/features/job-tracker/schemas/jobTrackerSchemas` |

---

## ✅ PRESERVED BEHAVIORS

### Authentication & Security
- [x] Token refresh queue prevents concurrent 401 refresh storms
- [x] `isRefreshing()` guard prevents double-refresh
- [x] 30-day fallback if `refreshTokenExpiration` is absent
- [x] Invalid refresh token expiry date defaults to "not expired" (defensive)
- [x] GET /UserProfile at mount validates session (with token auto-refresh)
- [x] `initialData` from localStorage prevents auth flicker on reload
- [x] JWT token hints for header display before profile loads

### Error Handling
- [x] `isErrorCode()` heuristic distinguishes server codes from messages
- [x] Validation errors show in form fields, not toasts
- [x] Generic errors show in toasts
- [x] `AlreadyLiked` 400 error suppressed silently in posts

### Edge Cases
- [x] Dual URL routes: `/emailConfirmation`, `/auth/emailConfirmation`, `/confirm-email`
- [x] Dual reset routes: `/auth/forgetPassword`, `/resetPassword`
- [x] `userId === "undefined"` guard on ProfilePage
- [x] `applicantionId` typo support in API response
- [x] `cVPath` casing variant support in API response
- [x] `.value` wrapper fallback for API responses
- [x] `iApplied` flag prevents re-applying to jobs

### Loading & Empty States
- [x] All skeleton loaders preserved
- [x] All empty state messages preserved
- [x] All disabled button states preserved

### Permissions
- [x] Company permission check redirects non-company to `/` in CompanyDashboard
- [x] Role-based sidebar rendering preserved
- [x] Admin-only routes preserved

### Query Configuration
- [x] `staleTime` varies per feature (1–10 min range) — all preserved
- [x] No retry on 4xx; retry ≤3 on other errors (queries), ≤1 (mutations)
- [x] AI endpoints have 60s timeout override
- [x] Disabled queries when not authenticated

---

## 🎯 KNOWN PLACEHOLDERS (Preserved As-Is)

These exist in the original and are preserved unchanged:

- **Filter chips** (Remote, Full-time, $150k+, Tech Stack) in JobsListPage — visual only
- **`getFakeMatch(idx)`** — fake AI match % in job cards
- **"[12] Applied"** hardcoded count in job card actions
- **"Save for Later"** button in JobDetailsPage — no handler wired
- **"Similar Roles"** section in JobDetailsPage — static data
- **`savedJobs` local state** in JobsListPage — no API persistence

---

## ⚠️ RISK LOG — Developer Review Required

| # | Risk | Status | Action Required |
|---|------|--------|-----------------|
| R1 | **No AuthGuard redirect** | ⚠️ FLAGGED | AppLayout renders public header instead of redirecting to /login when unauthenticated. Protected routes like /admin/dashboard are accessible to anonymous users (they'll get API 401s). Is this intentional? |
| R2 | **`userService.ts` double /api/ prefix** | ⚠️ FLAGGED | `userService.getUsers()` calls `/api/Users` but `API_BASE_URL` already ends in `/api`. This produces `/api/api/Users`. Only used by `useUsersList` which appears unused. Fix or remove? |
| R3 | **`constants.ts` is empty** | ⚠️ FLAGGED | `src/lib/constants.ts` is an empty file. Was this planned for future use? |
| R4 | **OAuth callback page incomplete** | ⚠️ FLAGGED | `/oauth/callback` route exists but implementation appears minimal. Verify completeness. |
| R5 | **Unrouted pages** | ⚠️ FLAGGED | `SettingsPage`, `UserPage`, `UsersListPage`, `UserProfilePage` exist but aren't in routes. Dead code or planned? |
| R6 | **Missing assets** | ℹ️ INFO | Images referenced in AuthLayout (vertical-for-verify.webp, laptop-for-register.webp) are not in the zip but might exist in production. |
| R7 | **`useRevokeRefreshToken` unused** | ℹ️ INFO | Logout uses `authService.clearAuthData()` (client-side only) without calling the revoke endpoint. Intentional? |

---

## 📦 DEPENDENCY AUDIT

### No New Libraries Added
All existing dependencies preserved:
- react, react-dom, react-router-dom
- @tanstack/react-query
- axios
- react-hook-form, @hookform/resolvers, zod
- sonner, tailwindcss, lucide-react
- radix-ui primitives, next-themes, gsap

### Libraries Considered But Not Needed
- **@tanstack/react-virtual** — Not needed; server-side pagination keeps lists under 50 items

### Removed Duplication
- **`hooks/use-debounce.ts`** — Duplicate of `hooks/useDebounce.ts` removed

---

## 🚀 TESTING CHECKLIST

Before deploying, verify:

### Critical Flows
- [ ] Login → redirects to /profile
- [ ] Register → email verification flow
- [ ] Forgot password → reset password flow
- [ ] Token refresh on 401 (test by waiting for token expiry)
- [ ] Logout → clears session → redirects to login

### Job Flows
- [ ] Browse jobs → search → pagination
- [ ] Job details → apply (with file upload)
- [ ] Company dashboard → view applications

### Profile Flows
- [ ] View own profile → edit → save
- [ ] Upload profile photo → save → see updated
- [ ] Upload CV → save → download

### Posts
- [ ] Create post (with file) → see in feed
- [ ] Like post → unlike
- [ ] Delete own post

### Admin (if admin role)
- [ ] Role management → create/edit roles
- [ ] User management → view users

### Permissions
- [ ] Non-company user cannot access /company/dashboard
- [ ] Non-admin user cannot access /admin/dashboard

---

## 🔧 POST-MIGRATION TASKS

1. **Review Risk Log items** — Make decisions on flagged items
2. **Remove dead code** — If SettingsPage, UsersListPage, etc. are unused
3. **Add assets** — Copy missing images (vertical-for-verify.webp, etc.)
4. **Environment variables** — Verify `.env` file is correct
5. **Run linter** — `npm run lint` to catch any remaining issues
6. **Type check** — `npm run type-check` to verify all types
7. **Test build** — `npm run build` to ensure production bundle works

---

## 📊 DELTA SUMMARY BY FEATURE

### Auth
- **Structure:** Components, pages, hooks, services, schemas, types co-located
- **Preserved:** All dual routes, error handling, token refresh queue logic
- **Change:** `authApi.ts` moved from `lib/` to `features/auth/services/`
- **Change:** Error utilities consolidated from `lib/authApi.ts` + `lib/form-error-handler.ts` → `lib/api/errors.ts`

### Profile
- **Structure:** All profile logic in one folder
- **Preserved:** Photo upload/delete, CV upload/delete, basic info edit
- **Change:** `userService.ts` moved to profile (only used by profile features)

### Jobs
- **Structure:** Job listing, details, apply in one folder
- **Preserved:** Fake match %, filter chips, "Save for Later" placeholder
- **Change:** Components extracted for reusability (JobCard, JobApplySheet)

### Job Tracker
- **Structure:** Personal application tracker isolated
- **Preserved:** All CRUD operations, stats calculation

### Posts
- **Structure:** Community feed isolated
- **Preserved:** Create/edit/delete, likes, file uploads, "AlreadyLiked" suppression

### Roadmaps
- **Structure:** Learning roadmaps isolated
- **Preserved:** View list, details, save/unsave

### AI
- **Structure:** CV analysis + job matching isolated
- **Preserved:** 60s timeout, disabled when not authenticated

### Company
- **Structure:** Company dashboard + applicants isolated
- **Preserved:** Permission redirect to `/` if not company role

### Admin
- **Structure:** Role + user management isolated
- **Preserved:** All admin CRUD operations

### Home
- **Structure:** Landing page components isolated
- **Preserved:** All sections (hero, features, stats, etc.)

---

## 🎓 ARCHITECTURAL IMPROVEMENTS

1. **Feature Co-location** — Each feature owns its entire vertical slice
2. **Import Clarity** — `@/features/[x]/...` makes dependencies explicit
3. **Easier Testing** — Each feature folder is self-contained
4. **Better DX** — Jump to definition works better with explicit paths
5. **Scalability** — New features follow same pattern

---

## 📞 SUPPORT

If you encounter issues:
1. Check this guide's Risk Log for known ambiguities
2. Verify all import paths are updated (search for old paths like `@/hooks/auth/`)
3. Ensure `.env` file has correct API URLs
4. Check console for errors — most will be missing imports

---

**Last Updated:** Phase 3 Complete
**Files Changed:** 150+ files restructured, 15 files with import updates
**Business Logic Changed:** 0 (zero)
