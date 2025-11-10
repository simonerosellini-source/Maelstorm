#!/bin/bash

echo "========================================"
echo "   iOS BUILD READINESS CHECK"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
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

# Check Expo CLI
echo "🔍 Checking Expo CLI..."
if command -v expo &> /dev/null; then
    EXPO_VERSION=$(expo --version)
    echo -e "${GREEN}✅ Expo CLI installed: $EXPO_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  Expo CLI NOT installed${NC}"
    echo "   Install with: npm install -g expo-cli"
fi
echo ""

# Check EAS CLI
echo "🔍 Checking EAS CLI..."
if command -v eas &> /dev/null; then
    EAS_VERSION=$(eas --version 2>&1 | head -1)
    echo -e "${GREEN}✅ EAS CLI installed: $EAS_VERSION${NC}"

    # Check if logged in
    if eas whoami &> /dev/null; then
        EAS_USER=$(eas whoami)
        echo -e "${GREEN}✅ Logged in as: $EAS_USER${NC}"
    else
        echo -e "${YELLOW}⚠️  Not logged in to EAS${NC}"
        echo "   Login with: eas login"
    fi
else
    echo -e "${YELLOW}⚠️  EAS CLI NOT installed${NC}"
    echo "   Install with: npm install -g eas-cli"
fi
echo ""

# Check app.json
echo "🔍 Checking app.json..."
if [ -f "app.json" ]; then
    echo -e "${GREEN}✅ app.json exists${NC}"

    # Check bundle identifier
    BUNDLE_ID=$(grep -o '"bundleIdentifier": "[^"]*"' app.json | cut -d'"' -f4)
    if [ -n "$BUNDLE_ID" ]; then
        echo -e "${GREEN}   Bundle ID: $BUNDLE_ID${NC}"
    else
        echo -e "${RED}   ❌ No bundle identifier found${NC}"
    fi

    # Check version
    VERSION=$(grep -m1 '"version": "[^"]*"' app.json | cut -d'"' -f4)
    if [ -n "$VERSION" ]; then
        echo -e "${GREEN}   Version: $VERSION${NC}"
    fi
else
    echo -e "${RED}❌ app.json NOT found${NC}"
fi
echo ""

# Check eas.json
echo "🔍 Checking eas.json..."
if [ -f "eas.json" ]; then
    echo -e "${GREEN}✅ eas.json exists${NC}"

    # Check if production env is configured
    if grep -q "EXPO_PUBLIC_SUPABASE_URL" eas.json; then
        SUPABASE_URL=$(grep -o '"EXPO_PUBLIC_SUPABASE_URL": "[^"]*"' eas.json | cut -d'"' -f4)
        if [ "$SUPABASE_URL" = "https://your-project.supabase.co" ]; then
            echo -e "${YELLOW}   ⚠️  Supabase URL not configured (still placeholder)${NC}"
        else
            echo -e "${GREEN}   ✅ Supabase URL configured${NC}"
        fi
    fi
else
    echo -e "${RED}❌ eas.json NOT found${NC}"
    echo "   Create it with: eas build:configure"
fi
echo ""

# Check package.json dependencies
echo "🔍 Checking package.json dependencies..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json exists${NC}"

    # Check for reanimated
    if grep -q "react-native-reanimated" package.json; then
        echo -e "${GREEN}   ✅ react-native-reanimated configured${NC}"
    else
        echo -e "${RED}   ❌ react-native-reanimated missing${NC}"
    fi

    # Check for expo
    if grep -q '"expo":' package.json; then
        EXPO_SDK=$(grep -o '"expo": "[^"]*"' package.json | cut -d'"' -f4)
        echo -e "${GREEN}   ✅ Expo SDK: $EXPO_SDK${NC}"
    fi
else
    echo -e "${RED}❌ package.json NOT found${NC}"
fi
echo ""

# Check babel.config.js
echo "🔍 Checking babel.config.js..."
if [ -f "babel.config.js" ]; then
    echo -e "${GREEN}✅ babel.config.js exists${NC}"

    if grep -q "react-native-reanimated/plugin" babel.config.js; then
        echo -e "${GREEN}   ✅ Reanimated plugin configured${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Reanimated plugin NOT configured${NC}"
    fi
else
    echo -e "${RED}❌ babel.config.js NOT found${NC}"
fi
echo ""

# Check node_modules
echo "🔍 Checking node_modules..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules exists (dependencies installed)${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules NOT found${NC}"
    echo "   Run: npm install"
fi
echo ""

# Summary
echo "========================================"
echo "   SUMMARY"
echo "========================================"
echo ""
echo "Next steps to build for iOS:"
echo ""
echo "1. If EAS CLI not installed:"
echo "   ${YELLOW}npm install -g eas-cli${NC}"
echo ""
echo "2. If not logged in:"
echo "   ${YELLOW}eas login${NC}"
echo ""
echo "3. Configure environment in eas.json:"
echo "   ${YELLOW}Edit eas.json and add your Supabase credentials${NC}"
echo ""
echo "4. Build for iOS:"
echo "   ${YELLOW}eas build --platform ios --profile production${NC}"
echo ""
echo "For detailed guide, see: ${GREEN}IOS_BUILD_GUIDE.md${NC}"
echo ""
