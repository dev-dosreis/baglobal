import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nome, empresa, email, whatsapp, necessidade, consentimento, origem, data_envio, page_url, user_agent } = body;

        // Basic validation
        if (!nome || !email || !empresa) {
            return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        const adminEmail = process.env.ADMIN_EMAIL || 'contato@baglobal.com.br';

        if (!resendApiKey || resendApiKey.includes('YOUR_API_KEY')) {
            console.error('RESEND_API_KEY não configurada');
            return NextResponse.json({ error: 'Erro de configuração no servidor' }, { status: 500 });
        }

        const resend = new Resend(resendApiKey);

        // Send email to Admin
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // Default Resend sender
            to: adminEmail,
            replyTo: email,
            subject: `Novo Lead - BA Global: ${empresa}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #FF6600;">Novo Lead Recebido</h2>
                    <p>Você recebeu um novo contato através do site.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr style="background-color: #f8f9fa;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Nome</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${nome}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Empresa</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${empresa}</td>
                        </tr>
                        <tr style="background-color: #f8f9fa;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">WhatsApp</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${whatsapp}</td>
                        </tr>
                        <tr style="background-color: #f8f9fa;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Necessidade</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${necessidade}</td>
                        </tr>
                     </table>

                    <h3 style="margin-top: 30px; font-size: 14px; color: #666;">Metadados</h3>
                    <ul style="font-size: 12px; color: #777;">
                        <li><strong>Data:</strong> ${data_envio}</li>
                        <li><strong>Origem:</strong> ${origem}</li>
                        <li><strong>URL:</strong> ${page_url}</li>
                    </ul>
                </div>
            `
        });

        if (error) {
            console.error('Erro Resend:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Email enviado com sucesso', id: data?.id });

    } catch (error) {
        console.error('Erro interno:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
