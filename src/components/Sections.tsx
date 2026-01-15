"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
    { name: "Soluções", href: "#solucoes" },
    { name: "Como funciona", href: "#como-funciona" },
    { name: "Segurança & Compliance", href: "#seguranca" },
    { name: "FAQ", href: "#faq" },
    { name: "Contato", href: "#contato" },
];

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
                ? "bg-background-base/90 backdrop-blur-xl border-b border-secondary-lighter py-4"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between max-w-[1200px]">
                <Link href="/" className="flex items-center group relative z-[70]">
                    <img
                        src="/logo-final.png"
                        alt="BAGLOBAL"
                        className="h-8 md:h-10 w-auto object-contain brightness-105 group-hover:scale-105 transition-transform duration-300"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex items-center space-x-4 pl-4 border-l border-secondary-lighter">
                        <Link
                            href="/login"
                            className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="#contato"
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/20"
                        >
                            Solicitar contato
                        </Link>
                    </div>
                </nav>

                {/* Mobile Nav Toggle */}
                <button
                    className="md:hidden text-foreground relative z-[70] p-2 hover:bg-secondary/50 rounded-lg transition-colors"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle Menu"
                >
                    {isMobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    )}
                </button>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-background-base z-[60] flex flex-col transition-all duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
                    }`}
                    style={{ height: '100dvh' }}>

                    {/* Interior Scroll Container */}
                    <div className="flex-1 overflow-y-auto px-6 pt-32 pb-12 w-full flex flex-col items-center">
                        <nav className="flex flex-col items-center space-y-10 w-full mb-12">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-2xl font-bold text-foreground hover:text-primary transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                        }`}
                                    style={{ transitionDelay: `${index * 50}ms` }}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        <div className={`flex flex-col items-center space-y-6 pt-10 border-t border-secondary-lighter w-full max-w-[280px] transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                            style={{ transitionDelay: `${navLinks.length * 50}ms` }}
                        >
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-xl font-bold text-foreground/70 hover:text-primary transition-colors"
                            >
                                Área do Cliente
                            </Link>
                            <Link
                                href="#contato"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-primary/30 w-full text-center active:scale-95"
                            >
                                Solicitar contato
                            </Link>
                        </div>
                    </div>

                    {/* Background Decorative Element */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
                </div>
            </div>
        </header>
    );
}

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Image Container */}
            <div className="absolute inset-0 -z-10 bg-background-base">
                {/* Connected World Background */}
                <div
                    className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none bg-center bg-cover bg-no-repeat"
                    style={{ backgroundImage: 'url("/hero-bg.png")' }}
                />

                {/* Primary Mesh Overlay */}
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[130px] rounded-full animate-blob pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary-lighter/10 blur-[130px] rounded-full animate-blob animation-delay-2000 pointer-events-none" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full animate-blob animation-delay-4000 pointer-events-none" />

                {/* Subtle Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.1] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(to right, #404040 1px, transparent 1px), linear-gradient(to bottom, #404040 1px, transparent 1px)`,
                        backgroundSize: '80px 80px',
                        maskImage: 'radial-gradient(ellipse at center, black, transparent 90%)'
                    }}
                />

                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            </div>

            <div className="container mx-auto px-6 max-w-[1200px] text-center md:text-left">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center space-x-2 bg-secondary/50 border border-secondary-lighter px-4 py-1.5 rounded-full mb-8">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-medium text-foreground/80 tracking-wide uppercase">Página institucional oficial</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
                        Pagamentos internacionais e gestão financeira para operações de <span className="text-primary text-glow">comércio exterior.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-foreground-muted mb-10 leading-relaxed max-w-2xl">
                        Gestão avançada de pagamentos, antecipação de recebíveis e pagamento de fornecedores em USD e USDt, com processo profissional e rastreável.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
                        <Link
                            href="#contato"
                            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl text-md font-bold transition-all shadow-xl shadow-primary/30 flex items-center justify-center transform hover:-translate-y-1"
                        >
                            Solicitar contato
                        </Link>
                        <Link
                            href="#solucoes"
                            className="w-full sm:w-auto bg-secondary hover:bg-secondary-light border border-secondary-lighter text-foreground px-8 py-4 rounded-xl text-md font-bold transition-all flex items-center justify-center"
                        >
                            Ver soluções
                        </Link>
                    </div>

                    <div className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start">
                        {[
                            "Operação com foco em compliance",
                            "Atuação documentada",
                            "Atendimento consultivo",
                        ].map((text) => (
                            <div key={text} className="flex items-center space-x-2 text-sm text-foreground/60">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5 text-primary"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .text-glow {
          text-shadow: 0 0 20px rgba(247, 100, 0, 0.2);
        }
      `}</style>
        </section>
    );
}

export function Solutions() {
    const solutions = [
        {
            title: "Gestão de pagamentos",
            description: "Contas a pagar/receber, conciliação bancária e relatórios financeiros detalhados para sua operação.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: "Antecipação de recebíveis",
            description: "Liquidez imediata para sua empresa através da antecipação de duplicatas, cheques e cartões.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
            ),
        },
        {
            title: "Pagamentos em USD e USDt",
            description: "Pagamento de fornecedores internacionais com agilidade e as melhores taxas do mercado de câmbio.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
            ),
        },
        {
            title: "Operação Assistida",
            description: "Integração completa e suporte consultivo para empresas que buscam eficiência operacional.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
            ),
        },
    ];

    return (
        <section id="solucoes" className="py-24 bg-background-alt relative">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="text-center mb-16">
                    <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-4">Soluções</h2>
                    <p className="text-3xl md:text-5xl font-bold">O que resolvemos</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {solutions.map((item, index) => (
                        <div
                            key={index}
                            className="bg-secondary p-6 md:p-8 rounded-2xl border border-secondary-lighter hover:border-primary/50 transition-all duration-300 group"
                        >
                            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                            <p className="text-foreground-muted text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function Timeline() {
    const steps = [
        {
            title: "Diagnóstico rápido",
            description: "Análise inicial de suas necessidades, volumes de transação e prazos operacionais.",
        },
        {
            title: "Estruturação",
            description: "Definição de fluxos, análise de documentação e enquadramento em compliance.",
        },
        {
            title: "Execução",
            description: "Processamento ágil dos pagamentos ou antecipação de recebíveis com segurança.",
        },
        {
            title: "Acompanhamento",
            description: "Relatórios de fechamento, suporte dedicado e otimização contínua de custos.",
        },
    ];

    return (
        <section id="como-funciona" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="text-center mb-20">
                    <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-4">Processo</h2>
                    <p className="text-3xl md:text-5xl font-bold">Como funciona</p>
                </div>

                <div className="relative">
                    {/* Horizontal Line for Desktop */}
                    <div className="hidden lg:block absolute top-12 left-0 w-full h-px bg-secondary-lighter" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative group text-center lg:text-left flex flex-col items-center lg:items-start">
                                <div className="mb-8 relative z-10">
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-secondary rounded-2xl border border-secondary-lighter flex items-center justify-center text-3xl md:text-4xl font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        {index + 1}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{step.title}</h3>
                                <p className="text-foreground-muted leading-relaxed max-w-[280px] lg:max-w-none">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Compliance() {
    const points = [
        {
            title: "Processos documentados",
            description: "Todas as operações seguem fluxos claros e auditáveis para máxima transparência.",
        },
        {
            title: "Trilha de auditoria",
            description: "Registro completo de cada etapa da transação, garantindo segurança jurídica.",
        },
        {
            title: "Privacidade (LGPD)",
            description: "Tratamento rigoroso de dados em conformidade com as leis de proteção vigentes.",
        },
        {
            title: "Políticas Publicadas",
            description: "Termos de uso e políticas de privacidade acessíveis e atualizados constantemente.",
        },
    ];

    return (
        <section id="seguranca" className="py-24 bg-background-alt relative">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-4">Segurança & Compliance</h2>
                        <p className="text-3xl md:text-5xl font-bold mb-8">Compromisso com a integridade</p>
                        <p className="text-foreground-muted text-lg mb-12 leading-relaxed">
                            Atuamos com foco total em compliance, garantindo que cada movimentação financeira seja realizada dentro das melhores práticas e regulamentações do mercado internacional.
                        </p>

                        <div className="space-y-4">
                            <p className="text-xs text-foreground/40 italic">
                                * Esta página tem caráter informativo e institucional.
                            </p>
                            <p className="text-xs text-foreground/40 italic">
                                * Condições e disponibilidade dos serviços variam conforme análise e enquadramento.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {points.map((point, index) => (
                            <div key={index} className="bg-secondary p-6 md:p-8 rounded-2xl border border-secondary-lighter shadow-sm">
                                <h3 className="text-lg font-bold mb-3">{point.title}</h3>
                                <p className="text-foreground-muted text-sm border-l-2 border-primary/30 pl-4">
                                    {point.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Institutional() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="bg-secondary/30 border border-secondary-lighter rounded-[2rem] p-8 md:p-16">
                    <div className="grid lg:grid-cols-5 gap-12">
                        <div className="lg:col-span-3">
                            <h2 className="text-2xl md:text-4xl font-bold mb-8 italic text-primary">Sobre a operação</h2>
                            <div className="space-y-6 text-foreground-muted text-lg leading-relaxed">
                                <p>
                                    A BAGLOBAL nasce da necessidade de profissionalismo e agilidade no mercado de comércio exterior. Combinamos expertise financeira com tecnologia de ponta para simplificar o complexo mundo dos pagamentos internacionais.
                                </p>
                                <p>
                                    Nossa atuação é focada em resultados tangíveis: liquidez para exportadores e segurança para importadores. Não somos apenas uma plataforma, somos o seu braço direito na execução financeira internacional.
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-background-base/50 p-8 rounded-2xl border border-secondary-lighter">
                                <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">Dados Institucionais</h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-secondary-lighter pb-2 gap-1 sm:gap-4">
                                        <span className="text-foreground/40">Posicionamento</span>
                                        <span className="font-medium text-right sm:text-left">Fintech / Comex</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-secondary-lighter pb-2 gap-1 sm:gap-4">
                                        <span className="text-foreground/40">Foco</span>
                                        <span className="font-medium text-right sm:text-left">Execução Digital</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-secondary-lighter pb-2 gap-1 sm:gap-4">
                                        <span className="text-foreground/40">Atuação</span>
                                        <span className="font-medium text-right sm:text-left">Global</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 gap-1 sm:gap-4">
                                        <span className="text-foreground/40">Status</span>
                                        <span className="text-green-500 font-bold flex items-center justify-end sm:justify-start">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                                            Operacional
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Contact() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        // Anti-spam: Honeypot check
        const honeypot = formData.get('website');
        if (honeypot) {
            // Silently fail for bots
            console.log('Bot detected via honeypot');
            setIsSubmitted(true);
            return;
        }

        setIsSubmitting(true);

        const data = {
            nome: formData.get('nome'),
            empresa: formData.get('empresa'),
            email: formData.get('email'),
            whatsapp: formData.get('whatsapp'),
            necessidade: formData.get('necessidade'),
            consentimento: true,
            origem: "/contato",
            data_envio: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
            page_url: typeof window !== 'undefined' ? window.location.href : '',
            user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setIsSubmitted(true);
                form.reset();
            } else {
                const errorData = await response.json();
                console.error("API error:", errorData);
                throw new Error(errorData.error || "Erro ao enviar formulário");
            }
        } catch (error) {
            console.error('❌ Erro no envio:', error);
            alert("Ocorreu um erro ao enviar. Por favor, tente novamente ou entre em contato diretamente pelo e-mail: contato@baglobal.com.br");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contato" className="py-24 relative">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="bg-secondary p-8 md:p-16 rounded-[2rem] border border-secondary-lighter relative overflow-hidden">
                    {/* Decorative blur */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />

                    <div className="grid lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-4">Contato</h2>
                            <p className="text-3xl md:text-5xl font-bold mb-8">Solicitar contato especialista</p>
                            <p className="text-foreground-muted text-lg mb-12 leading-relaxed">
                                Preencha o formulário e um de nossos especialistas em câmbio e gestão financeira entrará em contato em até 24h úteis.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-background-base rounded-xl border border-secondary-lighter flex items-center justify-center text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-foreground/40 uppercase font-bold tracking-widest">E-mail oficial</p>
                                        <p className="font-medium">contato@baglobal.com.br</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isSubmitted ? (
                            <div className="bg-background-base/50 p-12 rounded-3xl border border-primary/30 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">Solicitação enviada com sucesso!</h3>
                                <p className="text-foreground-muted">Um especialista entrará em contato em até 24h úteis.</p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-primary hover:underline text-sm font-bold pt-4"
                                >
                                    Enviar outra mensagem
                                </button>
                            </div>
                        ) : (
                            <form
                                className="space-y-6 bg-background-base/50 p-8 rounded-3xl border border-secondary-lighter"
                                onSubmit={handleSubmit}
                            >
                                {/* Honeypot field (hidden) */}
                                <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/60">Nome completo*</label>
                                        <input type="text" name="nome" placeholder="Seu nome" className="w-full bg-secondary border border-secondary-lighter rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/60">Empresa*</label>
                                        <input type="text" name="empresa" placeholder="Nome da empresa" className="w-full bg-secondary border border-secondary-lighter rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors" required />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/60">E-mail*</label>
                                        <input type="email" name="email" placeholder="email@empresa.com" className="w-full bg-secondary border border-secondary-lighter rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/60">WhatsApp*</label>
                                        <input type="tel" name="whatsapp" placeholder="(00) 00000-0000" className="w-full bg-secondary border border-secondary-lighter rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/60">Tipo de necessidade*</label>
                                    <select name="necessidade" className="w-full bg-secondary border border-secondary-lighter rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors text-foreground/70 appearance-none">
                                        <option>Gestão de pagamentos</option>
                                        <option>Antecipação</option>
                                        <option>Pagamentos USD/USDt</option>
                                        <option>Outro</option>
                                    </select>
                                </div>

                                <div className="flex items-start space-x-3 pt-4">
                                    <input type="checkbox" className="mt-1 accent-primary rounded" required />
                                    <span className="text-xs text-foreground/50 leading-relaxed">
                                        Concordo com a <Link href="/privacy" className="text-primary hover:underline">Política de Privacidade</Link> e autorizo o contato.
                                    </span>
                                </div>


                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar solicitação'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function FAQ() {
    const faqs = [
        { q: "Quais os prazos médios de execução?", a: "Para pagamentos internacionais, a execução ocorre geralmente no mesmo dia útil após a aprovação da documentação complementar." },
        { q: "Como funciona o pagamento via USDt?", a: "Utilizamos a tecnologia blockchain para garantir liquidez e agilidade global, sempre com a documentação e compliance necessários para a operação institucional." },
        { q: "Quais documentos são necessários?", a: "Iniciamos com KYC básico da empresa e, dependendo do volume, solicitamos notas fiscais ou contratos que comprovem a natureza da operação." },
        { q: "A BAGLOBAL oferece suporte consultivo?", a: "Sim, todas as nossas contas possuem acompanhamento de um gerente de operações para auxiliar nos fluxos e otimização de custos." }
    ];

    return (
        <section id="faq" className="py-24 bg-background-alt">
            <div className="container mx-auto px-6 max-w-[800px]">
                <h2 className="text-center text-3xl md:text-5xl font-bold mb-16">Dúvidas frequentes</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-secondary border border-secondary-lighter rounded-2xl p-6 md:p-8">
                            <h3 className="text-lg font-bold mb-4 flex items-center">
                                <span className="text-primary mr-4">Q.</span> {faq.q}
                            </h3>
                            <p className="text-foreground-muted leading-relaxed pl-8">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function Footer() {
    return (
        <footer className="py-12 border-t border-secondary-lighter">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                    <Link href="/" className="flex items-center group">
                        <img
                            src="/logo-final.png"
                            alt="BAGLOBAL"
                            className="h-8 md:h-10 w-auto object-contain opacity-80 group-hover:opacity-100 transition-all duration-300"
                        />
                    </Link>

                    <div className="flex flex-wrap justify-center gap-8 text-sm text-foreground/50">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacidade</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Termos</Link>
                        <Link href="/comunicado" className="hover:text-primary transition-colors">Comunicado</Link>
                        <Link href="#contato" className="hover:text-primary transition-colors">Contato</Link>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground/30 border-t border-secondary-lighter/50 pt-8">
                    <p>© {new Date().getFullYear()} — BAGLOBAL Digital Solutions</p>
                    <p className="px-3 py-1 bg-secondary rounded-full border border-secondary-lighter">
                        v1.0 • Página publicada para fins institucionais
                    </p>
                </div>

                <div className="mt-8 pt-8 border-t border-secondary-lighter/30 text-[10px] text-foreground/40 text-justify leading-relaxed max-w-4xl mx-auto">
                    <p className="mb-2 font-bold uppercase tracking-wider opacity-70">Disclaimer Jurídico</p>
                    <p>
                        A BS EMPREENDIMENTOS LTDA, pessoa jurídica de direito privado, constituída no território brasileiro, inscrita no CNPJ sob o nº 41.778.759/0001-87, com sede no Setor de Rádio e TV Sul, Quadra 701, Conjunto L, Bloco 02, nº 30, Sala 417, Parte H, Asa Sul, Brasília/DF, CEP: 70.340-906, atua como Prestadora de Serviços de Ativos Virtuais (PSAV), com a finalidade de prestar serviços de intermediação em operações com ativos virtuais — compreendendo compra e/ou venda de criptoativos. A empresa é classificada como intermediária, nos termos da Consulta Pública nº 109/2024 do Banco Central do Brasil. O licenciamento junto ao Banco Central será requerido tão logo o regulador inicie a fase de adequação legal, etapa que, até o presente momento, ainda não foi formalmente implementada. Não há necessidade de registro da CVM, uma vez que não se trata de operações/serviços com valores mobiliários.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export function TradingViewTicker() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbols": [
                {
                    "proName": "FX_IDC:USDBRL",
                    "title": "USD / BRL"
                },
                {
                    "proName": "BINANCE:USDTBRL",
                    "title": "USDT / BRL"
                },
                {
                    "proName": "BINANCE:BTCUSDT",
                    "title": "BTC / USDT"
                }
            ],
            "showSymbolLogo": true,
            "colorTheme": "dark",
            "isTransparent": true,
            "displayMode": "adaptive",
            "locale": "br"
        });

        const container = document.getElementById("tradingview-ticker-container");
        if (container) {
            container.appendChild(script);
        }

        return () => {
            if (container) {
                container.innerHTML = "";
            }
        };
    }, []);

    return (
        <div className="w-full bg-background-base/50 border-b border-secondary-lighter py-1 overflow-hidden">
            <div id="tradingview-ticker-container" className="tradingview-widget-container">
                <div className="tradingview-widget-container__widget"></div>
            </div>
        </div>
    );
}

export function WhatsAppWidget() {
    return (
        <a
            href="https://wa.me/551176720474"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
            aria-label="Fale conosco no WhatsApp"
        >
            <div className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
                Falar com especialista
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        </a>
    );
}
