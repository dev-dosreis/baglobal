import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const icons = [
  ['favicon-16x16.png', 16], ['favicon-32x32.png', 32], ['apple-touch-icon.png', 180],
  ['android-chrome-192x192.png', 192], ['android-chrome-512x512.png', 512],
];
for (const [filename, size] of icons) {
  await sharp('scripts/assets/icon-source.png').resize(size, size, { fit: 'contain', background: '#0b0c0f' }).png({ palette: true }).toFile(`public/${filename}`);
}
const icoPng = await sharp('public/favicon-32x32.png').toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header[6] = 32; header[7] = 32; header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(icoPng.length, 14); header.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([header, icoPng]));
await sharp('public/hero-bg.png').webp({ quality: 78, effort: 6 }).toFile('public/hero-bg.webp');
const backdrop = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#0b0c0f"/><rect x="72" y="250" width="72" height="7" fill="#f76400"/><text x="72" y="340" font-family="sans-serif" font-weight="bold" font-size="58" fill="white">Seu negócio, sem fronteiras.</text><text x="72" y="405" font-family="sans-serif" font-size="30" fill="#b5b5bf">Pagamentos internacionais e gestão financeira.</text><text x="72" y="550" font-family="sans-serif" font-size="24" fill="#f76400">baglobal.com.br</text></svg>`);
const logo = await sharp('public/logo-final.png').resize({ width: 420 }).toBuffer();
await sharp(backdrop).composite([{ input: logo, left: 72, top: 95 }]).png().toFile('public/og-image.png');
console.log('Ícones, hero WebP e imagem social otimizados.');
