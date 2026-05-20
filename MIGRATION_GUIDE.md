# 🔄 COMPONENT MIGRATION GUIDE
## Converting Hardcoded Colors to Semantic Tokens

---

## 📋 Quick Reference

### Common Color Replacements

```tsx
/* ══════════════════════════════════════════════════════════
   BLUE COLORS (Primary/Info)
   ══════════════════════════════════════════════════════════ */

// ❌ BEFORE
text-blue-500, text-blue-600, text-blue-700
bg-blue-50, bg-blue-100
border-blue-100, border-blue-200

// ✅ AFTER
text-primary          // or text-info for informational content
bg-info-subtle        // subtle blue background
border-info           // blue border

/* ══════════════════════════════════════════════════════════
   GRAY COLORS (Text/Muted)
   ══════════════════════════════════════════════════════════ */

// ❌ BEFORE
text-gray-400, text-gray-500, text-gray-600, text-gray-700, text-gray-900
bg-gray-50, bg-gray-100, bg-gray-200
border-gray-200, border-gray-300

// ✅ AFTER
text-muted            // Light gray text (gray-400/500)
text-secondary        // Medium gray text (gray-600/700)
text-primary          // Dark text (gray-900)
bg-muted              // Gray background
bg-surface-1          // Light surface
border-subtle         // Subtle border
border                // Default border

/* ══════════════════════════════════════════════════════════
   GREEN COLORS (Success)
   ══════════════════════════════════════════════════════════ */

// ❌ BEFORE
text-green-500, text-green-600, text-green-700
bg-green-50, bg-green-100
border-green-200

// ✅ AFTER
text-success
bg-success-subtle
border-success

/* ══════════════════════════════════════════════════════════
   RED COLORS (Destructive/Error)
   ══════════════════════════════════════════════════════════ */

// ❌ BEFORE
text-red-500, text-red-600
bg-red-50, bg-red-100
border-red-200

// ✅ AFTER
text-destructive
bg-destructive-subtle
border-destructive

/* ══════════════════════════════════════════════════════════
   YELLOW/ORANGE COLORS (Warning)
   ══════════════════════════════════════════════════════════ */

// ❌ BEFORE
text-yellow-600, text-orange-600
bg-yellow-50, bg-orange-50
border-yellow-200

// ✅ AFTER
text-warning
bg-warning-subtle
border-warning
```

---

## 🎯 Badge Migration

### Before: Hardcoded Badge
```tsx
<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
  Active
</span>
```

### After: Semantic Badge
```tsx
<span className="badge badge-info">
  Active
</span>
```

### All Badge Variants
```tsx
// Success (green)
<span className="badge badge-success">Approved</span>

// Warning (yellow)
<span className="badge badge-warning">Pending</span>

// Error (red)
<span className="badge badge-error">Rejected</span>

// Info (blue)
<span className="badge badge-info">Active</span>

// Neutral (gray)
<span className="badge badge-neutral">Draft</span>

// Primary (brand color)
<span className="badge badge-primary">Featured</span>
```

---

## 🃏 Card Migration

### Before: Hardcoded Card
```tsx
<div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
  {/* content */}
</div>
```

### After: Semantic Card
```tsx
<div className="card-base p-4">
  {/* content */}
</div>

// Or use variant classes:
<div className="card-elevated p-4">       {/* With shadow */}
<div className="card-interactive p-4">    {/* Hover effect */}
<div className="card-outlined p-4">       {/* No background */}
```

---

## 🔗 Link Migration

### Before: Hardcoded Link
```tsx
<a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
  Learn more
</a>
```

### After: Semantic Link
```tsx
<a href="#" className="link">
  Learn more
</a>
```

---

## 👤 Avatar Fallback Migration

### Before: Hardcoded Avatar
```tsx
<div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center">
  <span className="text-sm font-bold text-blue-600">JD</span>
</div>
```

### After: Semantic Avatar
```tsx
<div className="w-12 h-12 rounded-full avatar-fallback">
  <span className="text-sm font-bold">JD</span>
</div>

// Or muted variant:
<div className="w-12 h-12 rounded-full avatar-fallback-muted">
  <span className="text-sm font-bold">JD</span>
</div>
```

---

## 🚨 Alert Migration

### Before: Hardcoded Alert
```tsx
<div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
  Error occurred!
</div>
```

### After: Semantic Alert
```tsx
<div className="alert-error">
  Error occurred!
</div>

// Other variants:
<div className="alert-success">Success!</div>
<div className="alert-warning">Warning!</div>
<div className="alert-info">Information</div>
```

---

## 📍 Status Indicator Migration

### Before: Hardcoded Status Dot
```tsx
<span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
```

### After: Semantic Status Dot
```tsx
<span className="status-dot status-dot-success" />

// Other variants:
<span className="status-dot status-dot-warning" />
<span className="status-dot status-dot-error" />
<span className="status-dot status-dot-neutral" />
```

---

## 💀 Skeleton Loader Migration

### Before: Custom Skeleton
```tsx
<div className="bg-gray-200 rounded animate-pulse h-4 w-24" />
```

### After: Semantic Skeleton
```tsx
<div className="skeleton h-4 w-24" />
```

---

## ➗ Divider Migration

### Before: Hardcoded Divider
```tsx
<hr className="border-gray-200 my-4" />
```

### After: Semantic Divider
```tsx
<hr className="divider my-4" />

// Or stronger divider:
<hr className="divider-strong my-4" />
```

---

## 🎨 Complex Component Example

### UserCard - Complete Migration

#### ❌ BEFORE (Hardcoded)
```tsx
export function UserCard({ name, email, role }: Props) {
  const initials = name.split(' ').map(n => n[0]).join('');
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-blue-600">{initials}</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-tight truncate">
            {name}
          </p>
          <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
            {email}
          </p>
        </div>
        
        {/* Badge */}
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
          {role}
        </span>
      </div>
    </div>
  );
}
```

#### ✅ AFTER (Semantic)
```tsx
export function UserCard({ name, email, role }: Props) {
  const initials = name.split(' ').map(n => n[0]).join('');
  
  return (
    <div className="card-interactive p-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full avatar-fallback shrink-0">
          <span className="text-sm font-bold">{initials}</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-primary text-sm leading-tight truncate">
            {name}
          </p>
          <p className="text-xs text-secondary truncate flex items-center gap-1 mt-0.5">
            {email}
          </p>
        </div>
        
        {/* Badge */}
        <span className="badge badge-info text-[10px]">
          {role}
        </span>
      </div>
    </div>
  );
}
```

**Changes Made:**
1. `bg-white border border-gray-200` → `card-interactive`
2. `hover:shadow-md transition-shadow` → Built into `card-interactive`
3. `bg-blue-50 border-2 border-blue-100` + `text-blue-600` → `avatar-fallback`
4. `text-gray-900` → `text-primary`
5. `text-gray-500` → `text-secondary`
6. Custom badge styling → `badge badge-info`

---

## 🔍 Finding Hardcoded Colors

### Search Commands

```bash
# Find all blue color usage
grep -r "blue-" src --include="*.tsx" --include="*.ts"

# Find all gray color usage
grep -r "gray-" src --include="*.tsx"

# Find all red color usage
grep -r "red-" src --include="*.tsx"

# Find all green color usage
grep -r "green-" src --include="*.tsx"

# Find all yellow/orange usage
grep -r "yellow-\|orange-" src --include="*.tsx"
```

---

## ✅ Checklist

### For Each Component:

- [ ] Replace all blue colors with `primary`, `info`, or `text-link`
- [ ] Replace gray colors with text scale (`text-primary`, `text-secondary`, `text-muted`)
- [ ] Replace green with `success` tokens
- [ ] Replace red with `destructive` tokens
- [ ] Replace yellow/orange with `warning` tokens
- [ ] Replace custom badges with `badge` component classes
- [ ] Replace custom cards with `card-*` variants
- [ ] Replace custom links with `link` class
- [ ] Replace custom avatars with `avatar-fallback`
- [ ] Replace custom alerts with `alert-*` variants
- [ ] Test in both light and dark modes
- [ ] Verify contrast ratios (WCAG AA minimum)

---

## 🎯 Priority Order

1. **High Priority** (User-facing components)
   - UserCard
   - Badge components
   - Status indicators
   - Navigation items
   - Form elements

2. **Medium Priority** (Feature components)
   - Job cards
   - Post cards
   - Profile sections
   - Dashboard widgets

3. **Low Priority** (Admin/Internal)
   - Admin dashboard
   - Settings pages
   - Debug components

---

## 🚫 Common Mistakes to Avoid

### ❌ DON'T: Mix old and new
```tsx
<div className="bg-blue-50 text-primary">  {/* Mixed! */}
```

### ✅ DO: Use all semantic
```tsx
<div className="bg-info-subtle text-info">  {/* Consistent! */}
```

### ❌ DON'T: Use numeric colors
```tsx
<div className="text-gray-500">
```

### ✅ DO: Use semantic names
```tsx
<div className="text-secondary">
```

### ❌ DON'T: Create one-off patterns
```tsx
<span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
  Status
</span>
```

### ✅ DO: Use component patterns
```tsx
<span className="badge badge-info">
  Status
</span>
```

---

## 📚 Reference

### All Semantic Text Colors
- `text-primary` - Main text (darkest)
- `text-secondary` - Supporting text
- `text-muted` - De-emphasized text
- `text-placeholder` - Input placeholders
- `text-disabled` - Disabled text
- `text-link` - Hyperlinks
- `text-link-hover` - Link hover state
- `text-success` - Success messages
- `text-warning` - Warning messages
- `text-destructive` - Error messages
- `text-info` - Informational content

### All Semantic Backgrounds
- `bg-background` - Page background
- `bg-surface` / `bg-surface-1` / `bg-surface-2` / `bg-surface-3` - Surface levels
- `bg-card` - Card background
- `bg-muted` - Muted background
- `bg-success-subtle` - Success background
- `bg-warning-subtle` - Warning background
- `bg-info-subtle` - Info background
- `bg-destructive-subtle` - Error background

### All Semantic Borders
- `border` - Default border
- `border-subtle` - Subtle border
- `border-strong` - Strong border
- `border-success` - Success border
- `border-warning` - Warning border
- `border-info` - Info border
- `border-destructive` - Error border

---

**Need Help?** Check `THEMING_ARCHITECTURE.md` for complete system documentation.
