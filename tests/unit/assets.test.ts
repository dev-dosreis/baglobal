import { describe, expect, it } from 'vitest';
import sharp from 'sharp';

describe('Ícones e imagem de compartilhamento', () => {
  it.each([
    ['favicon-16x16.png',16], ['favicon-32x32.png',32], ['apple-touch-icon.png',180],
    ['android-chrome-192x192.png',192], ['android-chrome-512x512.png',512],
  ])('%s tem dimensões corretas e tamanho adequado', async (filename, size) => {
    const image = sharp(`public/${filename}`);
    const metadata = await image.metadata();
    expect(metadata.width).toBe(size); expect(metadata.height).toBe(size);
    expect((await image.toBuffer()).length).toBeLessThan(60000);
  });
});
