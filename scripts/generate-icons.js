#!/usr/bin/env node

/**
 * Icon Generator Script
 * Converts SVG icon to required formats for electron-builder
 * 
 * Requires ImageMagick (convert command) to be installed
 * On macOS: brew install imagemagick
 * On Ubuntu: sudo apt-get install imagemagick
 * On Windows: Download from https://imagemagick.org/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const assetsDir = path.join(__dirname, '..', 'assets');
const svgPath = path.join(assetsDir, 'icon.svg');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

console.log('🎨 WhatsBotX Icon Generator');
console.log('===========================\n');

// Check if ImageMagick is installed
try {
  execSync('convert --version', { stdio: 'ignore' });
  console.log('✅ ImageMagick found\n');
} catch (e) {
  console.error('❌ ImageMagick not found!');
  console.error('Install it with:');
  console.error('  macOS:  brew install imagemagick');
  console.error('  Linux:  sudo apt-get install imagemagick');
  console.error('  Windows: https://imagemagick.org/script/download.php\n');
  console.error('Alternatively, use the SVG template at assets/icon.svg and convert manually.\n');
  process.exit(1);
}

// Define required icon formats
const icons = [
  {
    name: 'Windows ICO',
    output: path.join(assetsDir, 'icon.ico'),
    size: '256x256',
    format: 'ico'
  },
  {
    name: 'macOS ICNS',
    output: path.join(assetsDir, 'icon.icns'),
    size: '512x512',
    format: 'icns',
    note: '(requires converting PNG to ICNS separately)'
  },
  {
    name: 'Linux PNG',
    output: path.join(assetsDir, 'icon.png'),
    size: '256x256',
    format: 'png'
  }
];

console.log('🔄 Converting icon.svg...\n');

icons.forEach((icon) => {
  try {
    // First convert SVG to intermediate PNG if needed
    let inputFile = svgPath;
    
    if (icon.format === 'icns') {
      // Create 512x512 PNG first, then convert to ICNS
      const pngTemp = path.join(assetsDir, 'icon-512.png');
      console.log(`  Converting SVG → PNG (512x512)...`);
      execSync(`convert -background none -size 512x512 "${svgPath}" -extent 512x512 "${pngTemp}"`, { stdio: 'pipe' });
      
      console.log(`  Converting PNG → ICNS...`);
      // Note: ICNS conversion on non-Mac requires sips (macOS) or third-party tools
      if (process.platform === 'darwin') {
        execSync(`sips -s format icns "${pngTemp}" --out "${icon.output}"`, { stdio: 'pipe' });
      } else {
        console.warn(`    ⚠️  ICNS generation skipped (requires macOS or online converter)`);
        console.warn(`    📋 Use: https://icoconvert.com/ to convert PNG → ICNS manually`);
        return;
      }
    } else {
      // For ICO and PNG, convert directly
      console.log(`  Converting SVG → ${icon.name} (${icon.size})...`);
      execSync(`convert -background none -size ${icon.size} "${svgPath}" -extent ${icon.size} "${icon.output}"`, { stdio: 'pipe' });
    }
    
    console.log(`  ✅ ${icon.name}: ${icon.output}`);
    
  } catch (error) {
    console.error(`  ❌ Failed to generate ${icon.name}:`);
    console.error(`     ${error.message}\n`);
  }
});

console.log('\n✨ Icon generation complete!\n');
console.log('📋 Next steps:');
console.log('  1. Verify icons in assets/ directory');
console.log('  2. Run: npm run build-win    (Windows .exe)');
console.log('  3. Run: npm run build-mac    (macOS .dmg)');
console.log('  4. Run: npm run build-linux  (Linux AppImage)\n');
console.log('🚀 For all platforms: npm run build-all\n');
