# WhatsBotX Build Guide

This document explains how to build and package WhatsBotX for Windows, macOS, and Linux.

## ⚠️ Important: Platform-Specific Builds

**Each platform's installer can ONLY be built on that platform:**
- 🪟 **Windows .exe** → Must build on Windows machine
- 🍎 **macOS .dmg** → Must build on macOS machine
- 🐧 **Linux AppImage** → Must build on Linux machine

This is a limitation of `electron-builder` and the underlying packaging tools. You cannot cross-compile (e.g., build a macOS app on Windows).

## Prerequisites

- Node.js 18+ and npm
- For macOS builds on macOS: Xcode Command Line Tools
- For Windows builds on Windows: Visual C++ Build Tools or VS 2022
- For Linux builds on Linux: build-essential, libssl-dev

## Icon Assets

Place the following icon files in the `assets/` directory:

- `icon.ico` — Windows icon (256×256 minimum, preferably 512×512)
- `icon.icns` — macOS icon (512×512 or 1024×1024)
- `icon.png` — Linux icon (256×256 minimum)

You can generate these from a single source image using online tools or ImageMagick:

```bash
# macOS: Convert PNG to ICNS (requires imagemagick on non-Mac)
convert -define icon:auto-resize=256,128,96,64,48,32,16 icon.png icon.icns

# Windows: Use online converter or ImageMagick
convert icon.png -resize 256x256 icon.ico
```

## Building for Each Platform

### Prerequisites Install

```bash
npm install
npm run build --list-targets  # Verify targets
```

### Windows Build (.exe + NSIS Installer)

**On Windows machine:**
```bash
npm run build-win
```

Builds:
- **Portable exe**: `dist/WhatsBotX-setup-2.0.0.exe`
- **NSIS installer**: `dist/WhatsBotX Setup 2.0.0.exe`

**Cross-compile from macOS/Linux** (not recommended; results may differ):
```bash
npm run build -- --win --publish never
```

### macOS Build (.dmg)

**On macOS machine:**
```bash
npm run build-mac
```

Builds:
- **DMG installer**: `dist/WhatsBotX-2.0.0.dmg`
- **Unpacked app**: `dist/WhatsBotX-2.0.0-mac/WhatsBotX.app`

For Intel and Apple Silicon support (universal app):
```bash
npm run build-mac -- --universal
```

### Linux Build (AppImage)

**On Linux machine:**
```bash
npm run build-linux
```

Builds:
- **AppImage**: `dist/WhatsBotX-2.0.0.AppImage`
- **snap**: (optional, requires snapcraft)

### Multi-Platform Build

⚠️ **Important**: You cannot build for multiple platforms on one machine.

To build for all platforms, you have two options:

**Option 1: Build on each machine (Recommended for small teams)**
```bash
# On Windows machine:
npm run build-win

# On macOS machine:
npm run build-mac

# On Linux machine:
npm run build-linux
```

**Option 2: Use CI/CD (GitHub Actions) - Recommended for production**
See [CI/CD Integration](#cicd-integration) section below.

## Distribution

After building, packages are in the `dist/` directory:

```
dist/
├── WhatsBotX Setup 2.0.0.exe        # Windows installer
├── WhatsBotX-2.0.0-mac/             # macOS app
├── WhatsBotX-2.0.0.AppImage         # Linux AppImage
└── ...
```

## Build Configuration

The build config is in `package.json` under the `"build"` key:

- **appId**: `com.whatsbotx.app`
- **productName**: `WhatsBotX`
- **Output dir**: `dist/`
- **Included files**: `src/`, `node_modules/`, `package.json`, `web/dist/`

To customize, edit `package.json` → `build` section.

## Troubleshooting

### Missing icons
- Ensure `assets/icon.ico`, `icon.icns`, and `icon.png` exist
- Use placeholder icons from online generator if needed

### Build fails on code signing (macOS)
- Set `--no-sign` flag: `npm run build-mac -- --no-sign`
- Or configure signing in build config

### Node modules too large
- Run `npm install --production` before building (removes dev deps from bundle)
- Or update `files` in package.json to exclude heavy optional dependencies

### AppImage permissions (Linux)
```bash
chmod +x dist/WhatsBotX-*.AppImage
```

## CI/CD Integration

### GitHub Actions (Recommended)

The project includes an automated build workflow (`.github/workflows/build.yml`) that builds for all platforms when you create a git tag.

**Setup (one-time):**

1. Push the workflow file to your repository:
```bash
git add .github/workflows/build.yml
git commit -m "Add build workflow"
git push
```

2. Ensure your repository settings allow GitHub Actions.

**Usage:**

Create a release tag to trigger cross-platform builds:

```bash
# Tag a release
git tag v2.0.1
git push origin v2.0.1
```

GitHub Actions will automatically:
1. Build on Windows (for .exe)
2. Build on macOS (for .dmg)
3. Build on Linux (for .AppImage)
4. Create a GitHub Release with all installers attached

**Check build status:**
- Go to your repository on GitHub
- Click "Actions" tab
- Watch the workflow run and complete
- Download all platform builds from the Release page

---

<div align="center">

**Made with ❤️ by Rudra Sharma**

[⭐ Star us on GitHub](https://github.com/Rudii-25/WhatsBotX) • [🐛 Report Issues](https://github.com/Rudii-25/WhatsBotX/issues) • [📧 Contact Us](mailto:rudra25trikha@gmail.com)

[🌐 Project Website](https://rudii-25.github.io/WhatsBotX/) • [👤 Rudra Sharma](https://rudrasharma25.com) • [🔗 LinkedIn](https://www.linkedin.com/in/rudra-sharma-714a7b259/)

---

© 2026 Rudra Sharma. All rights reserved.

</div>

### Local Setup (Multiple Machines)

For building on multiple local machines:

1. **On Windows machine:**
```bash
npm run build-win
# Outputs to: dist/WhatsBotX-*.exe
```

2. **On macOS machine:**
```bash
npm run build-mac
# Outputs to: dist/WhatsBotX-*.dmg
```

3. **On Linux machine:**
```bash
npm run build-linux
# Outputs to: dist/WhatsBotX-*.AppImage
```

Collect all artifacts into a single `release/` directory and distribute.

## Signing and Notarization

For production releases:

1. **Windows**: Obtain code signing certificate; update `win.certificateFile` in build config
2. **macOS**: Requires Apple Developer account for notarization; set `mac.identity` and notarization credentials
3. **Linux**: No signing required

See electron-builder docs for advanced signing configuration.

## Release Notes

Update `CHANGELOG.md` or create release notes in `dist/latest.yml` for auto-update functionality.
