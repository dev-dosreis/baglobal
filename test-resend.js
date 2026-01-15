const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// Basic .env parser
function loadEnv() {
    const envPath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    }
}

loadEnv();

const resendApiKey = process.env.RESEND_API_KEY;
const adminEmail = process.env.ADMIN_EMAIL || 'contato@baglobal.com.br';

if (!resendApiKey || resendApiKey.includes('YOUR_API_KEY')) {
    console.error('❌ RESEND_API_KEY não encontrada');
    process.exit(1);
}

const resend = new Resend(resendApiKey);

async function testSend() {
    console.log('--- Resend Test ---');
    console.log('To:', adminEmail);

    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: adminEmail,
            subject: 'Teste de Configuração',
            html: '<b>Teste</b>'
        });

        if (error) {
            console.error('❌ Resend Error:', JSON.stringify(error, null, 2));
        } else {
            console.log('✅ Success! ID:', data.id);
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

testSend();
