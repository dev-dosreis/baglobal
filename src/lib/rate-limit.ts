import { createHmac, randomBytes } from 'node:crypto';
import { isIP } from 'node:net';

const WINDOW_MS = 10 * 60 * 1000;
const REQUEST_LIMIT = 5;
const INCREMENT_WINDOW = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
return {count, redis.call('PTTL', KEYS[1])}
`;

type Limit = { allowed: boolean; retryAfter: number };
type Entry = { count: number; expiresAt: number };

function requestIdentity(request: Request) {
  // Vercel overwrites this header at its edge. Never trust X-Forwarded-For on arbitrary hosts.
  // Other deployments share a conservative bucket until a trusted proxy adapter is configured.
  const forwarded = process.env.VERCEL === '1'
    ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() : undefined;
  return forwarded && isIP(forwarded) ? forwarded : 'unknown-client';
}

function redisConfig() {
  const value = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!value && !token) return null;
  if (!value || !token) throw new Error('Rate limiter unavailable');
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Rate limiter unavailable');
  return { url: url.toString(), token };
}

async function consumeRedis(key: string, config: NonNullable<ReturnType<typeof redisConfig>>): Promise<Limit> {
  const response = await fetch(config.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['EVAL', INCREMENT_WINDOW, 1, key, WINDOW_MS]),
    cache: 'no-store', signal: AbortSignal.timeout(3000), redirect: 'error',
  });
  if (!response.ok) throw new Error('Rate limiter unavailable');
  const payload: unknown = await response.json();
  const result = payload && typeof payload === 'object' && 'result' in payload ? payload.result : null;
  if (!Array.isArray(result) || result.length !== 2
    || !Number.isSafeInteger(result[0]) || result[0] < 1
    || !Number.isSafeInteger(result[1]) || result[1] < 1 || result[1] > WINDOW_MS) {
    throw new Error('Rate limiter unavailable');
  }
  return { allowed: result[0] <= REQUEST_LIMIT, retryAfter: Math.ceil(result[1] / 1000) };
}

export function createContactRateLimiter({ now = Date.now, maxEntries = 5000 } = {}) {
  let entries = new Map<string, Entry>();
  const localSalt = randomBytes(32).toString('hex');

  function consumeMemory(key: string): Limit {
    const time = now();
    entries = new Map([...entries].filter(([, entry]) => entry.expiresAt > time));
    const entry = entries.get(key);
    if (!entry && entries.size >= maxEntries) throw new Error('Rate limiter unavailable');
    const next = { count: (entry?.count ?? 0) + 1, expiresAt: entry?.expiresAt ?? time + WINDOW_MS };
    entries = new Map([...entries, [key, next]]);
    return { allowed: next.count <= REQUEST_LIMIT, retryAfter: Math.ceil((next.expiresAt - time) / 1000) };
  }

  return {
    async consume(request: Request): Promise<Limit> {
      const config = redisConfig();
      const key = `contact:${createHmac('sha256', config?.token ?? localSalt)
        .update(requestIdentity(request)).digest('hex')}`;
      if (config) return consumeRedis(key, config);
      if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
        throw new Error('Rate limiter unavailable');
      }
      return consumeMemory(key);
    },
  };
}

export const contactRateLimiter = createContactRateLimiter();
