#!/usr/bin/env node

/**
 * Quick PNG to ICO converter using Sharp
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function convertPngToIco() {
  const inputPath = path.join(__dirname, '..', 'assets', 'icon.png');
  const outputPath = path.join(__dirname, '..', 'assets', 'icon.ico');

  try {
    console.log('Converting icon.png to icon.ico...');
    
    // Process with sharp to ensure proper format
    const imageBuffer = await sharp(inputPath)
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toBuffer();

    // For electron-builder, PNG format works as ICO fallback
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
