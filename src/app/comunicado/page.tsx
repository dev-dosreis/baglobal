import Link from "next/link";

export default function Comunicado() {
    return (
        <main className="min-h-screen bg-background-base text-foreground font-inter p-8 md:p-24">
            <div className="max-w-3xl mx-auto border border-secondary-lighter p-8 md:p-12 rounded-3xl bg-secondary/20 border-primary/20">
                <Link href="/" className="inline-flex items-center text-primary mb-12 hover:underline">
                    ← Voltar para Home
                </Link>
                <div className="mb-8 flex justify-between items-start">
                    <h1 className="text-4xl font-bold italic">Comunicado Institucional</h1>
                    <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-xs font-bold border border-primary/30">OFICIAL</span>
                </div>

                <div className="space-y-6 text-foreground-muted leading-relaxed">
                    <p className="font-bold text-foreground">Referente à Operação Digital BAGLOBAL</p>
                    <p>Informamos que, a partir desta data, a BAGLOBAL consolida sua presença digital com foco em operações de câmbio, gestão de pagamentos internacionais e antecipação de recebíveis no setor de comércio exterior.</p>
                    <p>Nossa operação segue os mais rigorosos padrões de compliance e segurança digital, visando proporcionar uma experiência transparente e profissional para todos os nossos parceiros e clientes.</p>
                    <p>Este canal é a fonte oficial de informações sobre nossas soluções e atualizações corporativas.</p>
                </div>

                <div className="mt-12 p-6 bg-background-base rounded-2xl border border-secondary-lighter space-y-2">
                    <p className="text-xs font-bold text-foreground/40 uppercase">Registro de Atuação</p>
                    <p className="text-sm">Publicado em: 13 de Janeiro de 2026</p>
                    <p className="text-sm">Versão do Sistema: 1.0.0</p>
                </div>
            </div>
        </main>
    );
}
