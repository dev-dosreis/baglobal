import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createContactRateLimiter } from '@/lib/rate-limit';

function incoming(headers: Record<string, string> = {}) {
  return new Request('https://baglobal.example/api/contact', { headers });
}
beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'test'); vi.stubEnv('VERCEL', '');
  vi.stubEnv('UPSTASH_REDIS_REST_URL', ''); vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('contact rate limiter', () => {
  it('allows five attempts and expires the ten-minute development window', async () => {
    let now = 0;
    const limiter = createContactRateLimiter({ now: () => now });
    for (let i = 0; i < 5; i += 1) expect((await limiter.consume(incoming())).allowed).toBe(true);
    expect(await limiter.consume(incoming())).toEqual({ allowed: false, retryAfter: 600 });
    now = 600_001;
    expect((await limiter.consume(incoming())).allowed).toBe(true);
  });

  it('ignores spoofed forwarding headers on arbitrary deployments', async () => {
    const limiter = createContactRateLimiter();
    for (let i = 0; i < 5; i += 1) {
      await limiter.consume(incoming({ 'x-forwarded-for': `1.2.3.${i}`, 'x-vercel-forwarded-for': `5.6.7.${i}` }));
    }
    expect((await limiter.consume(incoming({ 'x-forwarded-for': '9.8.7.6' }))).allowed).toBe(false);
  });

  it('uses only the platform-overwritten Vercel IP header and bounds memory', async () => {
    vi.stubEnv('VERCEL', '1');
    let now = 0;
    const limiter = createContactRateLimiter({ maxEntries: 2, now: () => now });
    expect((await limiter.consume(incoming({ 'x-vercel-forwarded-for': '1.2.3.4' }))).allowed).toBe(true);
    expect((await limiter.consume(incoming({ 'x-vercel-forwarded-for': '5.6.7.8' }))).allowed).toBe(true);
    await expect(limiter.consume(incoming({ 'x-vercel-forwarded-for': '9.8.7.6' }))).rejects.toThrow();
    now = 600_001;
    expect((await limiter.consume(incoming({ 'x-vercel-forwarded-for': '9.8.7.6' }))).allowed).toBe(true);
  });

  it('maps invalid forwarded IP values to the shared bucket', async () => {
    vi.stubEnv('VERCEL', '1');
    const limiter = createContactRateLimiter();
    for (let i = 0; i < 5; i += 1) await limiter.consume(incoming({ 'x-vercel-forwarded-for': `invalid-${i}` }));
    expect((await limiter.consume(incoming())).allowed).toBe(false);
  });

  it('fails closed in production without Redis', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    await expect(createContactRateLimiter().consume(incoming())).rejects.toThrow();
  });

  it('sends one atomic EVAL with a hashed IP and TTL to Redis', async () => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('VERCEL', '1');
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-redis-token');
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: [1, 600000] })));
    vi.stubGlobal('fetch', fetchMock);
    expect(await createContactRateLimiter().consume(incoming({ 'x-vercel-forwarded-for': '1.2.3.4' })))
      .toEqual({ allowed: true, retryAfter: 600 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('https://redis.example/');
    const command = JSON.parse(options.body);
    expect(command[0]).toBe('EVAL'); expect(command[1]).toContain('PEXPIRE');
    expect(command[2]).toBe(1); expect(command[3]).toMatch(/^contact:[a-f0-9]{64}$/);
    expect(command[4]).toBe(600000);
    expect(options.body).not.toContain('1.2.3.4');
    expect(options.headers.Authorization).toBe('Bearer test-redis-token');
    expect(options.cache).toBe('no-store');
  });

  it('returns Redis retry-after when the shared quota is exhausted', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-redis-token');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: [6, 10201] }))));
    expect(await createContactRateLimiter().consume(incoming())).toEqual({ allowed: false, retryAfter: 11 });
  });

  it.each([
    { result: null }, { result: [1] }, { result: ['1', 100] }, { result: [1, -1] },
    { result: [1, 900000] }, { result: [0, 100] }, { error: 'private failure' },
  ])('fails closed for malformed Redis responses %j', async (payload) => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-redis-token');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(payload))));
    await expect(createContactRateLimiter().consume(incoming())).rejects.toThrow();
  });

  it.each(['http://redis.example', 'invalid', 'https://user:pass@redis.example'])('rejects unsafe Redis URLs %s', async (url) => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', url); vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token');
    vi.stubGlobal('fetch', vi.fn());
    await expect(createContactRateLimiter().consume(incoming())).rejects.toThrow();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('does not fall back to memory when a configured store is unavailable', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-redis-token');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('connection failed')));
    await expect(createContactRateLimiter().consume(incoming())).rejects.toThrow();
  });

  it('rejects unsuccessful Redis HTTP responses', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-redis-token');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 503 })));
    await expect(createContactRateLimiter().consume(incoming())).rejects.toThrow();
  });
});
