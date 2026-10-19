export const MAX_CONTACT_BYTES = 16 * 1024;

export class ContactRequestError extends Error {
  constructor(public status: number, public publicMessage: string) {
    super(publicMessage);
  }
}

function configuredOrigin(value: string, production: boolean) {
  try {
    const url = new URL(value);
    if (url.username || url.password || !['http:', 'https:'].includes(url.protocol)) return null;
    if (production && url.protocol !== 'https:') return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function contactOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) throw new ContactRequestError(403, 'Origem da solicitação não permitida.');
  const production = process.env.NODE_ENV === 'production';
  const configured = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  const trusted = configured ? configuredOrigin(configured, production)
    : production ? null : new URL(request.url).origin;
  // Production must use a configured origin: request.url may originate from an untrusted Host header.
  if (!trusted) throw new ContactRequestError(503, 'O contato está temporariamente indisponível.');
  if (origin !== trusted) throw new ContactRequestError(403, 'Origem da solicitação não permitida.');
  return trusted;
}

export async function readContactBody(request: Request): Promise<unknown> {
  const type = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (type !== 'application/json') throw new ContactRequestError(415, 'Envie os dados no formato JSON.');
  if (!request.body) throw new ContactRequestError(400, 'Verifique os dados do formulário.');
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let decoded = '';
  let size = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new ContactRequestError(408, 'O envio demorou demais. Tente novamente.'));
      void reader.cancel().catch(() => undefined);
    }, 5000);
  });
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), deadline]);
      if (done) break;
      size += value.byteLength;
      if (size > MAX_CONTACT_BYTES) {
        void reader.cancel().catch(() => undefined);
        throw new ContactRequestError(413, 'O formulário excede o tamanho permitido.');
      }
      decoded += decoder.decode(value, { stream: true });
    }
    return JSON.parse(decoded + decoder.decode());
  } catch (error) {
    if (error instanceof ContactRequestError) throw error;
    throw new ContactRequestError(400, 'Verifique os dados do formulário.');
  } finally {
    clearTimeout(timeout);
    reader.releaseLock();
  }
}
