import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import nextConfig from '../../next.config';

describe('Proteções da plataforma', () => {
  it('protege formulários e framing sem desativar cache estático ou scripts do Next', async () => {
    const rules = await nextConfig.headers!();
    const csp = rules[0].headers.find(({ key }) => key === 'Content-Security-Policy')!.value;
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("script-src-attr 'none'");
    expect(csp).not.toContain('nonce-');
    expect(rules[0].headers.some(({ key }) => key.toLowerCase() === 'cache-control')).toBe(false);
  });
  it('configura proteção contra framing, MIME e vazamento de referrer', async () => {
    const rules = await nextConfig.headers!();
    const headers = rules[0].headers;
    expect(headers).toContainEqual({ key: 'X-Content-Type-Options', value: 'nosniff' });
    expect(headers).toContainEqual({ key: 'X-Frame-Options', value: 'DENY' });
    expect(headers).toContainEqual({ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' });
  });
});

describe('Descoberta nos buscadores', () => {
  it('sitemap usa somente URLs institucionais canônicas, sem portal ou API', () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      'https://baglobal.com.br', 'https://baglobal.com.br/privacy', 'https://baglobal.com.br/terms', 'https://baglobal.com.br/comunicado',
    ]);
  });
  it('robots publica o sitemap e impede rastreamento da API', () => {
    expect(robots()).toMatchObject({ sitemap: 'https://baglobal.com.br/sitemap.xml', rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/login'] } });
  });
});
