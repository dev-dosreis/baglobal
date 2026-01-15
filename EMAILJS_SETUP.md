# EmailJS Setup Instructions for BAGLOBAL Contact Form

## Quick Setup (5 minutes)

### 1. Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up with your email (contato@baglobal.com.br recommended)
3. Verify your email

### 2. Add Email Service
1. Go to "Email Services" in dashboard
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Connect your `contato@baglobal.com.br` account
5. **Copy the Service ID** (e.g., `service_abc123`)

### 3. Create Email Template (Admin Notification)
1. Go to "Email Templates"
2. Click "Create New Template"
3. **Template Name**: "Contact Form - Admin"
4. **Template ID**: `template_contact` (or copy the auto-generated one)
5. **Template Content**:

```
Subject: Nova solicitação de contato - {{empresa}}

Olá,

Você recebeu uma nova solicitação de contato através do site BAGLOBAL:

Nome: {{nome}}
Empresa: {{empresa}}
E-mail: {{email}}
WhatsApp: {{whatsapp}}
Tipo de necessidade: {{necessidade}}

---
Este é um email automático do formulário de contato BAGLOBAL.
```

6. **To Email**: `{{to_email}}` (will be contato@baglobal.com.br)
7. **From Name**: `BAGLOBAL - Formulário de Contato`
8. **Reply To**: `{{reply_to}}`
9. Save template

### 4. Create Auto-Reply Template (User Confirmation)
1. Create another template
2. **Template Name**: "Contact Form - User Confirmation"
3. **Template ID**: `template_autoreply`
4. **Template Content**:

```
Subject: Recebemos sua solicitação - BAGLOBAL

Olá {{nome}},

Obrigado por entrar em contato com a BAGLOBAL!

Recebemos sua solicitação sobre: {{necessidade}}

Nossa equipe irá analisar suas informações e retornar em até 24 horas úteis através do e-mail {{email}} ou WhatsApp {{whatsapp}}.

Atenciosamente,
Equipe BAGLOBAL
Digital Solutions

---
contato@baglobal.com.br
https://baglobal.com.br
```

5. **To Email**: `{{email}}` (user's email)
6. **From Name**: `BAGLOBAL`
7. Save template

### 5. Get Public Key
1. Go to "Account" → "General"
2. **Copy your Public Key** (e.g., `abc123xyz`)

### 6. Update Code
Open `src/components/Sections.tsx` and replace the placeholders:

```typescript
const response = await emailjs.send(
    'service_abc123',      // ← Replace with your Service ID
    'template_contact',    // ← Replace with your Template ID
    templateParams,
    'abc123xyz'            // ← Replace with your Public Key
);
```

### 7. Add Auto-Reply (Optional but Recommended)
After the first email send, add a second send for user confirmation:

```typescript
// Send to admin
await emailjs.send('service_abc123', 'template_contact', templateParams, 'abc123xyz');

// Send confirmation to user
await emailjs.send('service_abc123', 'template_autoreply', templateParams, 'abc123xyz');
```

### 8. Test
1. Run `npm run dev`
2. Fill out the contact form
3. Check if email arrives at contato@baglobal.com.br
4. Check if user receives confirmation email

## Troubleshooting

**Email not arriving?**
- Check EmailJS dashboard logs
- Verify Service is connected properly
- Check spam folder
- Ensure template variables match ({{nome}}, {{email}}, etc.)

**Rate limits?**
- Free tier: 200 emails/month
- Upgrade if needed at https://www.emailjs.com/pricing

## Current Implementation Status

✅ EmailJS package installed
✅ Contact form updated with EmailJS
✅ Loading state added to submit button
✅ Error handling implemented
⏳ **Pending**: EmailJS account configuration (follow steps above)

Once configured, the form will:
- Send all submissions to contato@baglobal.com.br
- Send confirmation email to the user
- Show loading state during submission
- Handle errors gracefully
