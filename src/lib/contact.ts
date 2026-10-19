import { z } from 'zod';

const withoutControlCharacters = /^[^\u0000-\u001f\u007f]*$/;
const contactText = (min: number, max: number) => z.string().trim().min(min).max(max)
  .regex(withoutControlCharacters);

export const contactSchema = z.object({
  nome: contactText(2, 100),
  empresa: contactText(2, 150),
  email: z.string().trim().max(254).email(),
  whatsapp: contactText(10, 40).regex(/^\+?[\d ().-]+$/)
    .refine((value) => {
      const digits = value.replace(/\D/g, '').length;
      return digits >= 10 && digits <= 15;
    }),
  necessidade: z.enum(['Gestão de pagamentos', 'Antecipação', 'Pagamentos USD/USDt', 'Outro']),
  consentimento: z.literal(true),
  website: z.literal(''),
});

export type Contact = z.infer<typeof contactSchema>;

function validEmail(value: string) {
  return z.string().max(254).email().safeParse(value).success;
}

export function contactEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.ADMIN_EMAIL?.trim();
  if (!apiKey || !from || !to || !withoutControlCharacters.test(from) || !validEmail(to)) return null;
  const sender = from.match(/^(?:[^<>]+<([^<>]+)>|([^<>]+))$/);
  const address = (sender?.[1] || sender?.[2])?.trim();
  if (!address || !validEmail(address) || address.toLowerCase().endsWith('@resend.dev')) return null;
  return { apiKey, from, to };
}

export function contactEmail(contact: Contact, origin: string) {
  return {
    replyTo: contact.email,
    subject: 'Novo contato comercial - BAGLOBAL',
    // Plain text prevents user-supplied markup from becoming executable email HTML.
    text: [
      'Novo contato pelo site BAGLOBAL', '',
      `Nome: ${contact.nome}`, `Empresa: ${contact.empresa}`, `E-mail: ${contact.email}`,
      `WhatsApp: ${contact.whatsapp}`, `Necessidade: ${contact.necessidade}`, '',
      'Consentimento de contato: confirmado',
      `Recebido em: ${new Date().toISOString()}`, `Origem: ${origin}`,
    ].join('\n'),
  };
}
