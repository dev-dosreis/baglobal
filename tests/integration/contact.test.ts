import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { sendEmail } = vi.hoisted(() => ({ sendEmail: vi.fn() }));
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendEmail };
  },
}));

const validContact = {
  nome: '  Ana Silva  ', empresa: '  Empresa Exemplo  ', email: ' ana@example.com ',
  whatsapp: '+55 (11) 99999-9999', necessidade: 'Gestão de pagamentos',
  consentimento: true, website: '',
};
let POST: (request: Request) => Promise<Response>;

function request(body: unknown = validContact, headers: Record<string, string> = {}) {
  return new Request('https://baglobal.example/api/contact', {
    method: 'POST', body: JSON.stringify(body),
    headers: { origin: 'https://baglobal.example', 'content-type': 'application/json', ...headers },
  });
}

beforeEach(async () => {
  vi.resetModules();
  vi.stubEnv('NODE_ENV', 'test');
  vi.stubEnv('SITE_URL', 'https://baglobal.example');
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
  vi.stubEnv('RESEND_API_KEY', 'test-provider-key');
  vi.stubEnv('RESEND_FROM_EMAIL', 'BAGLOBAL <site@baglobal.example>');
  vi.stubEnv('ADMIN_EMAIL', 'contato@baglobal.example');
  vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
  vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
  vi.stubEnv('VERCEL', '');
  sendEmail.mockReset().mockResolvedValue({ data: { id: 'email-confirmed' }, error: null });
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
  ({ POST } = await import('@/app/api/contact/route'));
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('POST /api/contact', () => {
  it('confirms success only after sending sanitized plain text with server metadata', async () => {
    const response = await POST(request({
      ...validContact, empresa: '<img src=x onerror=alert(1)>',
      page_url: 'https://attacker.example', user_agent: 'forged agent', data_envio: 'forged date',
    }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(expect.objectContaining({ success: true }));
    const message = sendEmail.mock.calls[0][0];
    expect(message.from).toBe('BAGLOBAL <site@baglobal.example>');
    expect(message.to).toBe('contato@baglobal.example');
    expect(message.replyTo).toBe('ana@example.com');
    expect(message.text).toContain('Ana Silva');
    expect(message.text).toContain('https://baglobal.example');
    expect(message.text).not.toMatch(/attacker\.example|forged agent|forged date/);
    expect(message.html).toBeUndefined();
    expect(message.subject).not.toMatch(/[\r\n]/);
    expect(sendEmail.mock.calls[0][1]?.signal).toBeInstanceOf(AbortSignal);
  });

  it.each([
    null, [], 'text', 1,
    { ...validContact, nome: 123 }, { ...validContact, nome: 'a' },
    { ...validContact, nome: 'x'.repeat(101) }, { ...validContact, empresa: 'x' },
    { ...validContact, empresa: 'x'.repeat(151) }, { ...validContact, email: 'bad-address' },
    { ...validContact, email: `${'x'.repeat(250)}@example.com` },
    { ...validContact, whatsapp: '123' }, { ...validContact, whatsapp: 'x'.repeat(11) },
    { ...validContact, whatsapp: '1234567890123456' },
    { ...validContact, necessidade: 'unauthorized service' },
    { ...validContact, consentimento: false }, { ...validContact, consentimento: 'true' },
    { ...validContact, consentimento: undefined }, { ...validContact, website: 'https://spam.example' },
    { ...validContact, website: undefined }, { ...validContact, empresa: 'Acme\r\nBcc: evil@example.com' },
  ].map((body) => [body]))('rejects invalid data without sending: %j', async (body) => {
    const response = await POST(request(body));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual(expect.objectContaining({ success: false }));
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it.each(['Gestão de pagamentos', 'Antecipação', 'Pagamentos USD/USDt', 'Outro'])('accepts service %s', async (necessidade) => {
    expect((await POST(request({ ...validContact, necessidade }))).status).toBe(200);
  });

  it('rejects malformed JSON', async () => {
    const response = await POST(new Request('https://baglobal.example/api/contact', {
      method: 'POST', headers: { origin: 'https://baglobal.example', 'content-type': 'application/json' }, body: '{',
    }));
    expect(response.status).toBe(400);
  });

  it('rejects non-JSON requests', async () => {
    expect((await POST(request(validContact, { 'content-type': 'text/plain' }))).status).toBe(415);
  });

  it.each(['https://attacker.example', 'null', '', 'https://baglobal.example/forged'])('rejects origin %s', async (origin) => {
    expect((await POST(request(validContact, { origin }))).status).toBe(403);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('rejects absent origin', async () => {
    const incoming = request(); incoming.headers.delete('origin');
    expect((await POST(incoming)).status).toBe(403);
  });

  it('does not trust a spoofed Host in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const incoming = new Request('https://attacker.example/api/contact', {
      method: 'POST', body: JSON.stringify(validContact),
      headers: { origin: 'https://attacker.example', host: 'attacker.example', 'content-type': 'application/json' },
    });
    expect((await POST(incoming)).status).toBe(403);
  });

  it.each(['', 'not a URL', 'http://baglobal.example', 'https://user:pass@baglobal.example'])('fails closed with untrusted production origin configuration %s', async (siteUrl) => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('SITE_URL', siteUrl);
    expect((await POST(request())).status).toBe(503);
  });

  it('allows the local request origin during development without a configured domain', async () => {
    vi.stubEnv('SITE_URL', ''); vi.stubEnv('NODE_ENV', 'development');
    expect((await POST(request())).status).toBe(200);
  });

  it('accepts NEXT_PUBLIC_SITE_URL as the trusted configured origin', async () => {
    vi.stubEnv('SITE_URL', ''); vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://baglobal.example');
    expect((await POST(request())).status).toBe(200);
  });

  it('limits the actual streamed body even with a forged content length', async () => {
    const stream = new ReadableStream<Uint8Array>({ start(controller) {
      controller.enqueue(new TextEncoder().encode('{"extra":"'));
      controller.enqueue(new Uint8Array(17 * 1024).fill(65)); controller.close();
    } });
    const incoming = new Request('https://baglobal.example/api/contact', {
      method: 'POST', body: stream, duplex: 'half',
      headers: { origin: 'https://baglobal.example', 'content-type': 'application/json', 'content-length': '2' },
    } as RequestInit);
    expect((await POST(incoming)).status).toBe(413);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('rejects bodies above 16 KiB', async () => {
    expect((await POST(request({ ...validContact, extra: 'x'.repeat(17 * 1024) }))).status).toBe(413);
  });

  it('decodes multibyte UTF-8 characters spanning streamed chunks', async () => {
    const bytes = new TextEncoder().encode(JSON.stringify({ ...validContact, nome: 'José Silva' }));
    const split = bytes.indexOf(0xc3) + 1;
    const body = new ReadableStream({ start(controller) {
      controller.enqueue(bytes.slice(0, split)); controller.enqueue(bytes.slice(split)); controller.close();
    } });
    const incoming = new Request('https://baglobal.example/api/contact', {
      method: 'POST', body, duplex: 'half',
      headers: { origin: 'https://baglobal.example', 'content-type': 'application/json; charset=utf-8' },
    } as RequestInit);
    expect((await POST(incoming)).status).toBe(200);
    expect(sendEmail.mock.calls[0][0].text).toContain('José Silva');
  });

  it('rejects invalid UTF-8 and stream failures', async () => {
    for (const body of [
      new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array([0xff])); controller.close(); } }),
      new ReadableStream({ start(controller) { controller.error(new Error('private data')); } }),
    ]) {
      const incoming = new Request('https://baglobal.example/api/contact', {
        method: 'POST', body, duplex: 'half',
        headers: { origin: 'https://baglobal.example', 'content-type': 'application/json' },
      } as RequestInit);
      expect((await POST(incoming)).status).toBe(400);
    }
  });

  it('bounds stalled request bodies without waiting for client cancellation', async () => {
    vi.useFakeTimers();
    const cancel = vi.fn(() => new Promise<void>(() => {}));
    const body = new ReadableStream({ cancel });
    const incoming = new Request('https://baglobal.example/api/contact', {
      method: 'POST', body, duplex: 'half',
      headers: { origin: 'https://baglobal.example', 'content-type': 'application/json' },
    } as RequestInit);
    try {
      let status: number | 'pending' = 'pending';
      void POST(incoming).then((response) => { status = response.status; });
      await vi.advanceTimersByTimeAsync(5001);
      expect(status).toBe(408);
      expect(cancel).toHaveBeenCalledOnce();
      expect(sendEmail).not.toHaveBeenCalled();
    } finally { vi.useRealTimers(); }
  });

  it('returns a validation error for a missing body', async () => {
    const incoming = new Request('https://baglobal.example/api/contact', {
      method: 'POST', headers: { origin: 'https://baglobal.example', 'content-type': 'application/json' },
    });
    expect((await POST(incoming)).status).toBe(400);
  });

  it('throttles after five requests and ignores untrusted forwarded IP headers', async () => {
    for (let i = 0; i < 5; i += 1) {
      expect((await POST(request(validContact, { 'x-forwarded-for': `1.2.3.${i}` }))).status).toBe(200);
    }
    const response = await POST(request(validContact, { 'x-forwarded-for': '8.8.8.8' }));
    expect(response.status).toBe(429);
    expect(Number(response.headers.get('retry-after'))).toBeGreaterThan(0);
  });

  it.each(['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'ADMIN_EMAIL'])('fails closed when %s is missing', async (key) => {
    vi.stubEnv(key, '');
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(sendEmail).not.toHaveBeenCalled();
    expect(JSON.stringify(await response.json())).not.toContain(key);
  });

  it.each([
    ['RESEND_FROM_EMAIL', 'onboarding@resend.dev'], ['RESEND_FROM_EMAIL', 'invalid'],
    ['RESEND_FROM_EMAIL', 'Site\r\nBcc: person@example.com <site@baglobal.example>'],
    ['ADMIN_EMAIL', 'invalid'], ['ADMIN_EMAIL', 'admin@example.com\r\nBcc: person@example.com'],
  ])('rejects invalid sender/recipient configuration', async (key, value) => {
    vi.stubEnv(key, value);
    expect((await POST(request())).status).toBe(503);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it.each([
    { data: null, error: { message: 'private provider error ana@example.com' } },
    { data: null, error: null }, { data: {}, error: null },
    { data: { id: '' }, error: null },
  ])('does not report success without provider confirmation', async (result) => {
    sendEmail.mockResolvedValueOnce(result);
    const response = await POST(request());
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(JSON.stringify(body)).not.toMatch(/private provider error|ana@example.com/);
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain('ana@example.com');
  });

  it('handles thrown provider errors without leaking data into logs or responses', async () => {
    sendEmail.mockRejectedValueOnce(new Error('secret ana@example.com'));
    const response = await POST(request());
    expect(response.status).toBe(502);
    expect(JSON.stringify(await response.json())).not.toContain('secret');
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toMatch(/secret|ana@example.com/);
  });

  it('fails closed in production without a persistent rate-limit store', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect((await POST(request())).status).toBe(503);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('uses the persistent quota in production before sending', async () => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('VERCEL', '1');
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-redis-token');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: [6, 20000] }))));
    const response = await POST(request(validContact, { 'x-vercel-forwarded-for': '1.2.3.4' }));
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('20');
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
