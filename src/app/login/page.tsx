import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);

        try {
            const response = await fetch("https://formspree.io/f/contato@baglobal.com.br", {
                method: "POST",
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                setIsSubmitted(true);
            } else {
                alert("Ocorreu um erro no portal. Por favor, contate seu gerente.");
            }
        } catch (error) {
            alert("Erro de conexão.");
        }
    };

    return (
        <main className="min-h-screen bg-background-base flex items-center justify-center relative overflow-hidden px-6">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 -z-10">
                <div
                    className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none bg-center bg-cover bg-no-repeat"
                    style={{ backgroundImage: 'url("/hero-bg.png")' }}
                />
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[130px] rounded-full animate-blob pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary-lighter/10 blur-[130px] rounded-full animate-blob animation-delay-2000 pointer-events-none" />
            </div>

            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <Link href="/" className="group">
                        <img
                            src="/logo-official.jpg"
                            alt="BAGLOBAL"
                            className="h-16 md:h-20 w-auto transform transition-transform group-hover:scale-105 object-contain"
                        />
                    </Link>
                </div>

                {/* Login Card */}
                <div className="bg-secondary/40 backdrop-blur-xl border border-secondary-lighter p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                    {isSubmitted ? (
                        <div className="text-center py-10 space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
                                <p className="text-foreground-muted text-sm">Identificamos sua solicitação de acesso. Nosso portal está passando por uma atualização de segurança e seu acesso será liberado em breve.</p>
                            </div>
                            <Link
                                href="/"
                                className="inline-block text-primary hover:underline text-sm font-bold"
                            >
                                Voltar para o início
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-10 text-center">
                                <h1 className="text-3xl font-bold mb-3 tracking-tight">Bem-vindo</h1>
                                <p className="text-foreground-muted text-sm">Acesse sua conta para gerenciar suas operações.</p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 ml-1">E-mail Corporativo</label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="seu@email.com.br"
                                            className="w-full bg-background-base/50 border border-secondary-lighter rounded-2xl px-5 py-4 text-sm focus:border-primary focus:outline-none transition-all focus:ring-1 focus:ring-primary/20 placeholder:text-foreground/20"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Senha</label>
                                        <button type="button" className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/60 hover:text-primary transition-colors">Esqueceu a senha?</button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="senha"
                                            placeholder="••••••••"
                                            className="w-full bg-background-base/50 border border-secondary-lighter rounded-2xl px-5 py-4 text-sm focus:border-primary focus:outline-none transition-all focus:ring-1 focus:ring-primary/20 placeholder:text-foreground/20"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] mt-4"
                                >
                                    Log In
                                </button>
                            </form>
                        </>
                    )}

                    <div className="mt-10 text-center">
                        <p className="text-xs text-foreground/30">
                            Ainda não tem acesso? <Link href="/#contato" className="text-primary hover:underline font-medium">Contate seu gerente</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] text-foreground/20 uppercase tracking-[0.3em] font-medium">
                    Secure Platform • 256-bit Encryption
                </div>
            </div>
        </main>
    );
}
