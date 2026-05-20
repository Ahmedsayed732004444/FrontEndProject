#!/bin/bash
# verify-rebuild.sh - Quick verification script for the rebuilt project

set -e

echo "🔍 Career Path Frontend Rebuild - Verification Script"
echo "======================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

check_pass() {
  echo -e "${GREEN}✓${NC} $1"
  ((PASSED++))
}

check_fail() {
  echo -e "${RED}✗${NC} $1"
  ((FAILED++))
}

check_warn() {
  echo -e "${YELLOW}⚠${NC} $1"
  ((WARNINGS++))
}

echo "1. Checking directory structure..."
[[ -d "src/app" ]] && check_pass "src/app exists" || check_fail "src/app missing"
[[ -d "src/features" ]] && check_pass "src/features exists" || check_fail "src/features missing"
[[ -d "src/shared" ]] && check_pass "src/shared exists" || check_fail "src/shared missing"
[[ -d "src/lib" ]] && check_pass "src/lib exists" || check_fail "src/lib missing"

echo ""
echo "2. Checking feature modules..."
for feature in auth profile jobs job-tracker posts roadmaps ai interview company admin home; do
  if [[ -d "src/features/$feature" ]]; then
    check_pass "Feature module: $feature"
  else
    check_fail "Feature module missing: $feature"
  fi
done

echo ""
echo "3. Checking critical files..."
[[ -f "src/app/App.tsx" ]] && check_pass "App.tsx exists" || check_fail "App.tsx missing"
[[ -f "src/app/main.tsx" ]] && check_pass "main.tsx exists" || check_fail "main.tsx missing"
[[ -f "src/app/routes/index.tsx" ]] && check_pass "routes/index.tsx exists" || check_fail "routes/index.tsx missing"
[[ -f "src/lib/api/client.ts" ]] && check_pass "API client exists" || check_fail "API client missing"
[[ -f "src/lib/api/errors.ts" ]] && check_pass "Error utilities exist" || check_fail "Error utilities missing"

echo ""
echo "4. Checking for old import patterns (should be 0)..."
OLD_IMPORTS=$(grep -r "@/hooks/auth/" src/ 2>/dev/null | grep -v "node_modules" | wc -l || echo "0")
if [[ "$OLD_IMPORTS" -eq 0 ]]; then
  check_pass "No old hook imports found"
else
  check_warn "Found $OLD_IMPORTS old hook imports (run: grep -r '@/hooks/auth/' src/)"
fi

OLD_SERVICES=$(grep -r "@/services/" src/ 2>/dev/null | grep -v "node_modules" | grep -v "@/features/" | wc -l || echo "0")
if [[ "$OLD_SERVICES" -eq 0 ]]; then
  check_pass "No old service imports found"
else
  check_warn "Found $OLD_SERVICES old service imports (run: grep -r '@/services/' src/ | grep -v '@/features/')"
fi

echo ""
echo "5. Checking configuration files..."
[[ -f "package.json" ]] && check_pass "package.json exists" || check_fail "package.json missing"
[[ -f "tsconfig.json" ]] && check_pass "tsconfig.json exists" || check_fail "tsconfig.json missing"
[[ -f "vite.config.ts" ]] && check_pass "vite.config.ts exists" || check_fail "vite.config.ts missing"

echo ""
echo "6. Checking documentation..."
[[ -f "MIGRATION.md" ]] && check_pass "MIGRATION.md exists" || check_warn "MIGRATION.md missing"
[[ -f "README.md" ]] && check_pass "README.md exists" || check_warn "README.md missing"
[[ -f "REBUILD_SUMMARY.md" ]] && check_pass "REBUILD_SUMMARY.md exists" || check_warn "REBUILD_SUMMARY.md missing"

echo ""
echo "======================================================"
echo "Verification Summary:"
echo -e "${GREEN}Passed: $PASSED${NC}"
[[ $WARNINGS -gt 0 ]] && echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
[[ $FAILED -gt 0 ]] && echo -e "${RED}Failed: $FAILED${NC}"

echo ""
if [[ $FAILED -eq 0 ]]; then
  echo -e "${GREEN}✓ Rebuild structure looks good!${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Review MIGRATION.md Risk Log"
  echo "  2. Run: npm install"
  echo "  3. Run: npm run type-check"
  echo "  4. Run: npm run build"
  echo "  5. Test all critical flows (see MIGRATION.md)"
else
  echo -e "${RED}✗ Issues found - please review failures above${NC}"
  exit 1
fi
