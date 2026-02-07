#!/bin/bash
# Quick build script for WhatsBotX on macOS/Linux
# Note: Can only build for the current platform (Windows on Windows, macOS on macOS, Linux on Linux)
# Usage: ./build.sh [mac|linux|help]

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

show_help() {
  echo -e "${BLUE}WhatsBotX Build Script - Help${NC}"
  echo "=============================="
  echo ""
  echo "Platform-specific builds require running on the target OS."
  echo ""
  echo "On macOS machine:"
  echo "  ./build.sh mac          (Creates .dmg installer)"
  echo ""
  echo "On Linux machine:"
  echo "  ./build.sh linux        (Creates .AppImage installer)"
  echo ""
  echo "On Windows machine:"
  echo "  build.bat win           (Creates .exe installer)"
  echo ""
  echo "For cross-platform distribution:"
  echo "  1. Use GitHub Actions CI/CD workflow"
  echo "  2. Or run build commands on each platform manually"
  echo ""
}

if [ $# -eq 0 ]; then
  echo -e "${BLUE}WhatsBotX Build Script${NC}"
  echo "======================"
  echo ""
  echo "Usage: ./build.sh [target]"
  echo ""
  echo "Targets:"
  echo "  mac      - Build macOS .dmg"
  echo "  linux    - Build Linux AppImage"
  echo "  help     - Show this help message"
  echo ""
  echo "NOTE: Platform-specific builds require the correct OS:"
  echo "  - Windows installer (exe): Run on Windows machine"
  echo "  - macOS app (.dmg): Run on macOS machine"
  echo "  - Linux app (.AppImage): Run on Linux machine"
  echo ""
  echo "Examples:"
  echo "  ./build.sh mac"
  echo "  ./build.sh linux"
  echo ""
  exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "Error: package.json not found. Run this script from the project root."
  exit 1
fi

TARGET=$1

if [ "$TARGET" = "help" ]; then
  show_help
  exit 0
fi

echo -e "${BLUE}WhatsBotX Build Tool${NC}"
echo "===================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
  echo ""
fi

# Detect current platform
if [[ "$OSTYPE" == "darwin"* ]]; then
  CURRENT_PLATFORM="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  CURRENT_PLATFORM="Linux"
else
  CURRENT_PLATFORM="Unknown"
fi

# Run the build command
case $TARGET in
  mac)
    if [ "$CURRENT_PLATFORM" != "macOS" ]; then
      echo -e "${RED}❌ Error: macOS builds can only be created on macOS machines.${NC}"
      echo ""
      echo "To build for macOS, run on a Mac:"
      echo "  ./build.sh mac"
      echo ""
      exit 1
    fi
    echo "Building for macOS..."
    npm run build-mac
    ;;
  linux)
    if [ "$CURRENT_PLATFORM" != "Linux" ]; then
      echo -e "${RED}❌ Error: Linux builds can only be created on Linux machines.${NC}"
      echo ""
      echo "To build for Linux, run on a Linux machine:"
      echo "  ./build.sh linux"
      echo ""
      exit 1
    fi
    echo "Building for Linux..."
    npm run build-linux
    ;;
  *)
    echo "Unknown target: $TARGET"
    show_help
    exit 1
    ;;
esac

if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✅ Build completed successfully!${NC}"
  echo ""
  echo "Output location: ./dist/"
  echo ""
  case $TARGET in
    mac)
      echo "macOS packages created:"
      echo "  - WhatsBotX-2.0.0.dmg (Disk Image - recommended)"
      echo "  - WhatsBotX-2.0.0-mac.zip"
      ;;
    linux)
      echo "Linux packages created:"
      echo "  - WhatsBotX-2.0.0.AppImage"
      echo "  - whatsbotx_2.0.0_amd64.deb"
      ;;
  esac
  echo ""
else
  echo ""
  echo -e "${RED}❌ Build failed!${NC}"
  exit 1
fi

