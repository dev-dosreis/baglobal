"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";

const inputClass = "w-full rounded-xl border border-secondary-lighter bg-background-base px-4 py-3 text-base text-foreground placeholder:text-foreground-muted/80";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const submitting = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => () => requestRef.current?.abort(), []);
  useEffect(() => { if (status === "success" || status === "error") resultRef.current?.focus(); }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    submitting.current = true;
    setStatus("sending");
    setErrorMessage("");
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({
          nome: values.get("nome"), empresa: values.get("empresa"), email: values.get("email"),
          whatsapp: values.get("whatsapp"), necessidade: values.get("necessidade"),
          consentimento: values.get("consentimento") === "on", website: values.get("website") ?? "",
        }),
      });
      if (response.status === 429) {
        setErrorMessage("Você enviou várias solicitações. Aguarde alguns minutos e tente novamente, ou fale com a equipe por e-mail.");
        setStatus("error"); return;
      }
      const result: unknown = response.ok ? await response.json() : null;
      if (!response.ok || typeof result !== "object" || result === null || !("success" in result) || result.success !== true) {
        throw new Error("Contact unavailable");
      }
      form.reset(); setStatus("success");
    } catch {
      setErrorMessage("Não foi possível enviar sua solicitação. Seus dados foram mantidos. Tente novamente ou escreva para contato@baglobal.com.br.");
      setStatus("error");
    } finally {
      window.clearTimeout(timeout); submitting.current = false; requestRef.current = null;
    }
  }

  return (
    <section id="contato" data-floating-contact-boundary aria-labelledby="contact-title" className="py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-10 rounded-3xl border border-secondary-lighter bg-secondary p-6 md:p-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Contato</p>
            <h2 id="contact-title" className="mb-6 text-3xl font-bold tracking-tight md:text-5xl">Vamos conversar sobre a sua operação.</h2>
            <p className="mb-8 text-lg leading-relaxed text-foreground-muted">Conte o que sua empresa precisa. Nossa equipe vai orientar os próximos passos para pagamentos internacionais e gestão financeira.</p>
            <a href="mailto:contato@baglobal.com.br" className="contact-email inline-flex min-h-11 items-center gap-3 break-all text-base font-medium text-primary hover:underline">
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></svg>
              contato@baglobal.com.br
            </a>
            <p className="mt-6 text-sm leading-relaxed text-foreground-muted">Use este formulário apenas para contato comercial. Não envie senhas, documentos ou dados de conta.</p>
          </div>
          {status === "success" ? <div ref={resultRef} tabIndex={-1} role="status" className="rounded-2xl border border-primary/40 bg-background-base p-8">
            <span aria-hidden="true" className="mb-6 block text-4xl text-primary">✓</span>
            <h3 className="mb-4 text-2xl font-bold">Solicitação enviada com sucesso!</h3>
            <p className="mb-6 leading-relaxed text-foreground-muted">Nossa equipe recebeu seu contato e retornará pelo e-mail ou WhatsApp informado.</p>
            <button type="button" onClick={() => setStatus("idle")} className="min-h-11 text-primary underline underline-offset-4">Enviar outra mensagem</button>
          </div> : <form method="post" action="/api/contact" onSubmit={handleSubmit} aria-busy={status === "sending"} aria-describedby="contact-instructions" className="space-y-5 rounded-2xl border border-secondary-lighter bg-background-base/50 p-5 md:p-8">
            <p id="contact-instructions" className="text-sm text-foreground-muted">Todos os campos são obrigatórios.</p>
            <div hidden aria-hidden="true"><label htmlFor="contact-website">Deixe este campo vazio</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label htmlFor="contact-name" className="form-label">Nome completo</label><input id="contact-name" name="nome" autoComplete="name" minLength={2} maxLength={100} required className={inputClass} placeholder="Seu nome" /></div>
              <div><label htmlFor="contact-company" className="form-label">Empresa</label><input id="contact-company" name="empresa" autoComplete="organization" minLength={2} maxLength={150} required className={inputClass} placeholder="Nome da empresa" /></div>
            </div>
            <div><label htmlFor="contact-email" className="form-label">E-mail</label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required className={inputClass} placeholder="voce@empresa.com.br" /></div>
            <div><label htmlFor="contact-phone" className="form-label">WhatsApp</label><input id="contact-phone" name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" minLength={10} maxLength={30} pattern={"\\+?(?:[\\(\\) .\\-]*[0-9]){10,15}[\\(\\) .\\-]*"} aria-describedby="phone-hint" required className={inputClass} placeholder="+55 (11) 99999-9999" /><p id="phone-hint" className="mt-2 text-sm text-foreground-muted">Inclua o DDD e, para outros países, o código internacional.</p></div>
            <div><label htmlFor="contact-need" className="form-label">Tipo de necessidade</label><select id="contact-need" name="necessidade" required className={inputClass} defaultValue="Gestão de pagamentos"><option>Gestão de pagamentos</option><option>Antecipação</option><option>Pagamentos USD/USDt</option><option>Outro</option></select></div>
            <div className="flex items-start gap-3"><input id="contact-consent" name="consentimento" type="checkbox" required className="mt-1 size-5 shrink-0 accent-primary" /><label htmlFor="contact-consent" className="text-sm leading-relaxed text-foreground-muted">Li a <Link href="/privacy" className="text-primary underline underline-offset-4">Política de Privacidade</Link> e autorizo o contato para atender à minha solicitação.</label></div>
            {status === "error" && <div ref={resultRef} tabIndex={-1} role="alert" className="rounded-xl border border-red-400/50 bg-red-950/30 p-4 text-sm leading-relaxed text-red-200">{errorMessage}</div>}
            <button type="submit" disabled={status === "sending"} className="btn-primary w-full px-5 py-4 disabled:cursor-wait disabled:opacity-70">{status === "sending" ? "Enviando..." : "Enviar solicitação"}</button>
            <noscript><p>Para enviar o formulário, ative o JavaScript ou escreva para <a href="mailto:contato@baglobal.com.br">contato@baglobal.com.br</a>.</p></noscript>
          </form>}
        </div>
      </div>
    </section>
  );
}
