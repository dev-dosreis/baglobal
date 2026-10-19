import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Termos de Uso", description: "Condições de uso do site institucional da BAGLOBAL.", alternates: { canonical: "/terms" } };

export default function Terms() {
    return (
        <main id="conteudo" tabIndex={-1} className="legal-page min-h-screen bg-background-base text-foreground font-inter p-8 md:p-24">
            <div className="legal-card max-w-3xl mx-auto border border-secondary-lighter p-8 md:p-12 rounded-3xl bg-secondary/20">
                <Link href="/" className="inline-flex items-center text-primary mb-12 hover:underline">
                    ← Voltar para Home
                </Link>
                <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>
                <div className="space-y-6 text-foreground-muted leading-relaxed">
                    <p>Ao acessar este site, você concorda em cumprir estes termos de serviço e todas as leis aplicáveis.</p>
                    <h2 className="text-xl font-bold text-foreground">1. Caráter Institucional</h2>
                    <p>Este site tem caráter estritamente informativo e institucional. As informações aqui contidas não constituem oferta vinculante ou garantia de contratação.</p>
                    <h2 className="text-xl font-bold text-foreground">2. Propriedade Intelectual</h2>
                    <p>O conteúdo, logo e design deste site são de propriedade da BAGLOBAL Digital Solutions.</p>
                    <h2 className="text-xl font-bold text-foreground">3. Limitação de Responsabilidade</h2>
                    <p>As condições de serviços financeiros variam conforme análise individual e enquadramento de compliance.</p>
                </div>
                <div className="mt-12 pt-8 border-t border-secondary-lighter text-xs text-foreground-muted">
                    Última atualização: 13/01/2026
                </div>
            </div>
        </main>
    );
}
