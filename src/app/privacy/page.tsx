import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Política de Privacidade", description: "Saiba como a BAGLOBAL utiliza os dados fornecidos para atendimento comercial.", alternates: { canonical: "/privacy" } };

export default function Privacy() {
    return (
        <main id="conteudo" tabIndex={-1} className="legal-page min-h-screen bg-background-base text-foreground font-inter p-8 md:p-24">
            <div className="legal-card max-w-3xl mx-auto border border-secondary-lighter p-8 md:p-12 rounded-3xl bg-secondary/20">
                <Link href="/" className="inline-flex items-center text-primary mb-12 hover:underline">
                    ← Voltar para Home
                </Link>
                <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
                <div className="space-y-6 text-foreground-muted leading-relaxed">
                    <p>A BAGLOBAL se compromete com a proteção dos seus dados pessoais. Esta política descreve como coletamos e utilizamos suas informações em conformidade com a LGPD.</p>
                    <h2 className="text-xl font-bold text-foreground">1. Coleta de Dados</h2>
                    <p>Coletamos apenas os dados necessários via formulário de contato (nome, empresa, e-mail e WhatsApp) para fins de atendimento comercial.</p>
                    <h2 className="text-xl font-bold text-foreground">2. Uso das Informações</h2>
                    <p>Seus dados são utilizados exclusivamente para retornar seu contato e oferecer nossas soluções financeiras.</p>
                    <h2 className="text-xl font-bold text-foreground">3. Seus Direitos</h2>
                    <p>Você pode solicitar a exclusão ou alteração dos seus dados a qualquer momento através do e-mail contato@baglobal.com.br.</p>
                </div>
                <div className="mt-12 pt-8 border-t border-secondary-lighter text-xs text-foreground-muted">
                    Última atualização: 13/01/2026
                </div>
            </div>
        </main>
    );
}
