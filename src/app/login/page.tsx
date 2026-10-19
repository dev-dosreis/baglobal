import type { Metadata } from "next";
import Image from "next/image";
import logo from "../../../public/logo-final.png";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Área do cliente",
  description: "Entre em contato com a equipe BAGLOBAL para acompanhar sua operação.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <main id="conteudo" tabIndex={-1} className="flex min-h-screen items-center justify-center bg-background-base px-6 py-16">
      <div className="w-full max-w-lg">
        <Link href="/" aria-label="BAGLOBAL — início" className="mb-12 inline-block"><Image src={logo} alt="BAGLOBAL" width={280} height={38} sizes="280px" preload /></Link>
        <div className="rounded-3xl border border-secondary-lighter bg-secondary p-7 md:p-10">
          <p className="mb-4 text-sm font-medium text-primary">Atendimento BAGLOBAL</p>
          <h1 className="mb-5 text-3xl font-bold">Área do cliente</h1>
          <p className="mb-4 leading-relaxed text-foreground-muted">O atendimento e o acompanhamento das operações são realizados diretamente com nossa equipe.</p>
          <p className="mb-8 leading-relaxed text-foreground-muted">Fale com seu responsável ou solicite contato pelos canais oficiais. Não solicitamos sua senha por este site.</p>
          <Link href="/#contato" className="btn-primary mb-5 block px-6 py-4 text-center">Falar com a equipe</Link>
          <a href="mailto:contato@baglobal.com.br" className="block break-all py-3 text-center text-primary underline underline-offset-4">contato@baglobal.com.br</a>
        </div>
        <Link href="/" className="mt-6 inline-flex min-h-11 items-center text-sm text-foreground-muted hover:text-primary">← Voltar para o início</Link>
      </div>
    </main>
  );
}
