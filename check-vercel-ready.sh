#!/bin/bash

echo "========================================"
echo "   VERCEL DEPLOY READINESS CHECK"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js
echo "🔍 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js NOT installed${NC}"
    echo "   Install from: https://nodejs.org"
fi
echo ""

# Check NPM
echo "🔍 Checking NPM..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ NPM installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ NPM NOT installed${NC}"
fi
echo ""

# Check Vercel CLI
echo "🔍 Checking Vercel CLI..."
if command -v vercel &> /dev/null; then
    VERCEL_VERSION=$(vercel --version)
    echo -e "${GREEN}✅ Vercel CLI installed: $VERCEL_VERSION${NC}"

    # Check if logged in
    if vercel whoami &> /dev/null 2>&1; then
        VERCEL_USER=$(vercel whoami)
        echo -e "${GREEN}✅ Logged in as: $VERCEL_USER${NC}"
    else
        echo -e "${YELLOW}⚠️  Not logged in to Vercel${NC}"
        echo "   Login with: vercel login"
    fi
else
    echo -e "${YELLOW}⚠️  Vercel CLI NOT installed${NC}"
    echo "   Install with: npm install -g vercel"
fi
echo ""

# Check vercel.json
echo "🔍 Checking vercel.json..."
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✅ vercel.json exists${NC}"

    # Check if it references packages/api
    if grep -q "packages/api" vercel.json; then
        echo -e "${GREEN}   ✅ Configured for packages/api${NC}"
    else
        echo -e "${YELLOW}   ⚠️  May not be configured for monorepo${NC}"
    fi
else
    echo -e "${RED}❌ vercel.json NOT found${NC}"
    echo "   This file configures Vercel deployment"
fi
echo ""

# Check API directory
echo "🔍 Checking API directory..."
if [ -d "packages/api" ]; then
    echo -e "${GREEN}✅ packages/api exists${NC}"

    # Check package.json
    if [ -f "packages/api/package.json" ]; then
        echo -e "${GREEN}   ✅ package.json found${NC}"

        # Check Next.js dependency
        if grep -q '"next":' packages/api/package.json; then
            NEXT_VERSION=$(grep -o '"next": "[^"]*"' packages/api/package.json | cut -d'"' -f4)
            echo -e "${GREEN}   ✅ Next.js: $NEXT_VERSION${NC}"
        else
            echo -e "${RED}   ❌ Next.js NOT found in dependencies${NC}"
        fi

        # Check Supabase dependency
        if grep -q '@supabase/supabase-js' packages/api/package.json; then
            echo -e "${GREEN}   ✅ Supabase client configured${NC}"
        else
            echo -e "${RED}   ❌ Supabase client NOT found${NC}"
        fi
    else
        echo -e "${RED}   ❌ package.json NOT found${NC}"
    fi

    # Check next.config.js
    if [ -f "packages/api/next.config.js" ]; then
        echo -e "${GREEN}   ✅ next.config.js found${NC}"
    else
        echo -e "${YELLOW}   ⚠️  next.config.js NOT found${NC}"
    fi

    # Check tsconfig.json
    if [ -f "packages/api/tsconfig.json" ]; then
        echo -e "${GREEN}   ✅ tsconfig.json found${NC}"
    else
        echo -e "${YELLOW}   ⚠️  tsconfig.json NOT found${NC}"
    fi
else
    echo -e "${RED}❌ packages/api NOT found${NC}"
fi
echo ""

# Check API routes
echo "🔍 Checking API routes..."
if [ -d "packages/api/src/pages/api" ]; then
    echo -e "${GREEN}✅ API routes directory exists${NC}"

    # Count route files
    ROUTE_COUNT=$(find packages/api/src/pages/api -name "*.ts" -o -name "*.js" | wc -l)
    echo -e "${GREEN}   Found $ROUTE_COUNT API route files${NC}"

    # Check specific routes
    if [ -f "packages/api/src/pages/api/game/monsters.ts" ]; then
        echo -e "${GREEN}   ✅ /api/game/monsters${NC}"
    fi

    if [ -f "packages/api/src/pages/api/game/spells.ts" ]; then
        echo -e "${GREEN}   ✅ /api/game/spells${NC}"
    fi

    if [ -f "packages/api/src/pages/api/game/classes.ts" ]; then
        echo -e "${GREEN}   ✅ /api/game/classes${NC}"
    fi

    if [ -f "packages/api/src/pages/api/auth/register.ts" ]; then
        echo -e "${GREEN}   ✅ /api/auth/register${NC}"
    fi
else
    echo -e "${RED}❌ API routes directory NOT found${NC}"
fi
echo ""

# Check game data
echo "🔍 Checking game data..."
if [ -d "packages/data" ]; then
    echo -e "${GREEN}✅ packages/data exists${NC}"

    # Check JSON files
    if [ -f "packages/data/monsters.json" ]; then
        MONSTER_COUNT=$(grep -c '"id":' packages/data/monsters.json)
        echo -e "${GREEN}   ✅ monsters.json ($MONSTER_COUNT monsters)${NC}"
    fi

    if [ -f "packages/data/spells.json" ]; then
        SPELL_COUNT=$(grep -c '"id":' packages/data/spells.json)
        echo -e "${GREEN}   ✅ spells.json ($SPELL_COUNT spells)${NC}"
    fi

    if [ -f "packages/data/classes.json" ]; then
        CLASS_COUNT=$(grep -c '"id":' packages/data/classes.json)
        echo -e "${GREEN}   ✅ classes.json ($CLASS_COUNT classes)${NC}"
    fi
else
    echo -e "${RED}❌ packages/data NOT found${NC}"
fi
echo ""

# Check git status
echo "🔍 Checking Git status..."
if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Git repository${NC}"

    # Check if there are uncommitted changes
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}   ✅ Working directory clean${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Uncommitted changes${NC}"
        echo "   Consider committing before deploy"
    fi

    # Check current branch
    CURRENT_BRANCH=$(git branch --show-current)
    echo -e "${BLUE}   Current branch: $CURRENT_BRANCH${NC}"

    # Check if connected to remote
    if git remote -v | grep -q "origin"; then
        echo -e "${GREEN}   ✅ Remote repository configured${NC}"
    else
        echo -e "${YELLOW}   ⚠️  No remote repository${NC}"
    fi
else
    echo -e "${RED}❌ Not a git repository${NC}"
fi
echo ""

# Summary
echo "========================================"
echo "   SUMMARY & NEXT STEPS"
echo "========================================"
echo ""

# Count issues
READY=true

if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}1. Install Vercel CLI:${NC}"
    echo "   npm install -g vercel"
    echo ""
    READY=false
fi

if command -v vercel &> /dev/null && ! vercel whoami &> /dev/null 2>&1; then
    echo -e "${YELLOW}2. Login to Vercel:${NC}"
    echo "   vercel login"
    echo ""
    READY=false
fi

echo -e "${BLUE}3. Configure Supabase credentials:${NC}"
echo "   You'll need these from https://supabase.com:"
echo "   - Project URL"
echo "   - Anon/Public Key"
echo "   - Service Role Key"
echo ""

if $READY; then
    echo -e "${GREEN}✅ READY TO DEPLOY!${NC}"
    echo ""
    echo "Deploy with:"
    echo -e "${YELLOW}  cd $(pwd)${NC}"
    echo -e "${YELLOW}  vercel${NC}                    # Preview deploy"
    echo -e "${YELLOW}  vercel --prod${NC}             # Production deploy"
else
    echo -e "${YELLOW}⚠️  Complete setup steps above first${NC}"
fi

echo ""
echo "For detailed guide, see:"
echo -e "${GREEN}  VERCEL_DEPLOY_GUIDE.md${NC}"
echo ""

echo "To add environment variables during deploy:"
echo "  1. Vercel will prompt you for env vars"
echo "  2. Or set via dashboard: vercel.com → Project → Settings → Environment Variables"
echo ""

echo "Expected API endpoints after deploy:"
echo "  https://your-project.vercel.app/api/game/monsters"
echo "  https://your-project.vercel.app/api/game/spells"
echo "  https://your-project.vercel.app/api/game/classes"
echo "  https://your-project.vercel.app/api/auth/register"
echo ""
