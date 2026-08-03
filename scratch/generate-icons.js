const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const dir = path.join(process.cwd(), 'public', 'icons');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const generateSvg = (size, isMaskable = false) => `
    <svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="${isMaskable ? 0 : 96}" fill="#0d1117"/>
      <circle cx="256" cy="230" r="150" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="12"/>
      <path d="M256 120 L315 180 L295 260 L217 260 L197 180 Z" fill="none" stroke="#34d399" stroke-width="14" stroke-linejoin="round"/>
      <circle cx="256" cy="230" r="36" fill="#34d399"/>
      <text x="256" y="420" font-family="Arial, sans-serif" font-weight="900" font-size="44" fill="#ffffff" text-anchor="middle" letter-spacing="4">SITE TIME</text>
    </svg>
  `;

  const svg192 = Buffer.from(generateSvg(192));
  const svg512 = Buffer.from(generateSvg(512));
  const svgMaskable = Buffer.from(generateSvg(512, true));

  await sharp(svg192).png().toFile(path.join(dir, 'icon-192x192.png'));
  await sharp(svg512).png().toFile(path.join(dir, 'icon-512x512.png'));
  await sharp(svgMaskable).png().toFile(path.join(dir, 'icon-maskable-512x512.png'));
  await sharp(svg512).png().toFile(path.join(dir, 'apple-touch-icon.png'));

  console.log('PWA PNG icons generated successfully!');
}

generate().catch(console.error);
