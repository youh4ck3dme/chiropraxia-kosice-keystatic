import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = './public';
const IMAGES_DIR = './public/images';

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') return;

  const outputPath = filePath.replace(ext, '.webp');
  
  try {
    console.log(`Optimizing: ${filePath} -> ${outputPath}`);
    await sharp(filePath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    
    const oldSize = (await fs.stat(filePath)).size;
    const newSize = (await fs.stat(outputPath)).size;
    const reduction = ((oldSize - newSize) / oldSize * 100).toFixed(2);
    
    console.log(`Done! Size: ${oldSize} -> ${newSize} (${reduction}% reduction)`);
  } catch (err) {
    console.error(`Error optimizing ${filePath}:`, err);
  }
}

async function main() {
  // 1. Optimize root files (like chiropraxia.png)
  const rootFiles = await fs.readdir(PUBLIC_DIR);
  for (const file of rootFiles) {
    await optimizeImage(path.join(PUBLIC_DIR, file));
  }

  // 2. Optimize images directory
  const imageFiles = await fs.readdir(IMAGES_DIR);
  for (const file of imageFiles) {
    await optimizeImage(path.join(IMAGES_DIR, file));
  }
}

main();
