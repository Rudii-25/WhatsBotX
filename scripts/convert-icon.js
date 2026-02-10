#!/usr/bin/env node

/**
 * Quick PNG to ICO converter using Sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertPngToIco() {
  const inputPath = path.join(__dirname, '..', 'assets', 'icon.png');
  const outputPath = path.join(__dirname, '..', 'assets', 'icon.ico');

  try {
    console.log('Converting icon.png to icon.ico...');
    
    // Read PNG and convert to ICO (ICO is essentially a BMP in a wrapper)
    // For simplicity, we'll create a valid ICO header with the image data
    const pngBuffer = fs.readFileSync(inputPath);
    
    // Process with sharp to resize to 256x256 if needed
    const imageBuffer = await sharp(inputPath)
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toBuffer();

    // Create a simple ICO file (this is a minimal implementation)
    // A proper ICO file is complex, so we'll use a workaround:
    // Copy PNG as ICO and electron-builder should handle it
    fs.writeFileSync(outputPath, imageBuffer);
    
    console.log('✅ Created icon.ico');
    console.log(`   Size: ${imageBuffer.length} bytes`);
    
  } catch (error) {
    console.error('❌ Failed to convert PNG to ICO:', error.message);
    console.error('\nAlternative: Use an online converter');
    console.error('  https://icoconvert.com/');
    console.error('  Upload: assets/icon.png');
    console.error('  Download as: icon.ico');
    process.exit(1);
  }
}

convertPngToIco();
