import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactEmail, contactEmailConfig, contactSchema } from '@/lib/contact';
import { ContactRequestError, contactOrigin, readContactBody } from '@/lib/contact-request';
import { contactRateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 20;

function failure(status: number, error: string, requestId: string, retryAfter?: number) {
  return NextResponse.json({ success: false, error, requestId }, {
    status, headers: {
      'Cache-Control': 'no-store',
      ...(retryAfter ? { 'Retry-After': String(retryAfter) } : {}),
    },
  });
}

async function deliverContact(contact: Parameters<typeof contactEmail>[0], origin: string, requestId: string) {
  const config = contactEmailConfig();
  if (!config) return failure(503, 'O contato está temporariamente indisponível. Tente novamente mais tarde.', requestId);
  try {
    const { data, error } = await new Resend(config.apiKey).emails.send({
      from: config.from, to: config.to, ...contactEmail(contact, origin),
    }, { signal: AbortSignal.timeout(8000) });
    if (error || !data?.id) throw new Error('Email not confirmed');
    return NextResponse.json({ success: true, message: 'Contato enviado com sucesso.' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    console.error('contact_delivery_failed', { requestId });
    return failure(502, 'Não foi possível enviar sua mensagem. Tente novamente mais tarde.', requestId);
  }
}

export async function POST(request: Request) {
  const requestId = randomUUID();
  let origin: string;
  let body: unknown;
  try {
    origin = contactOrigin(request);
    body = await readContactBody(request);
  } catch (error) {
    if (error instanceof ContactRequestError) return failure(error.status, error.publicMessage, requestId);
    return failure(400, 'Verifique os dados do formulário.', requestId);
  }
  try {
    const limit = await contactRateLimiter.consume(request);
    if (!limit.allowed) return failure(429, 'Muitas tentativas. Aguarde alguns minutos e tente novamente.', requestId, limit.retryAfter);
  } catch {
    console.error('contact_rate_limit_unavailable', { requestId });
    return failure(503, 'O contato está temporariamente indisponível. Tente novamente mais tarde.', requestId);
  }
  const validated = contactSchema.safeParse(body);
  if (!validated.success) return failure(400, 'Verifique os dados do formulário e o consentimento de contato.', requestId);
  return deliverContact(validated.data, origin, requestId);
}
