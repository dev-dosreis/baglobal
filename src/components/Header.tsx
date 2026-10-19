"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import logo from "../../public/logo-final.png";
import Link from "next/link";

const navLinks = [
  { name: "Soluções", href: "#solucoes" },
  { name: "Como funciona", href: "#como-funciona" },
  { name: "Segurança & Compliance", href: "#seguranca" },
  { name: "FAQ", href: "#faq" },
  { name: "Contato", href: "#contato" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const links = menuRef.current?.querySelectorAll<HTMLAnchorElement>("a");
      const first = links?.[0];
      const last = links?.[links.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); toggleRef.current?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); toggleRef.current?.focus();
      } else if (document.activeElement === toggleRef.current) {
        event.preventDefault(); (event.shiftKey ? last : first)?.focus();
      }
    }
    function handleResize() {
      if (window.innerWidth >= 1280) setIsMobileMenuOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileMenuOpen]);

  function closeMenu() {
    setIsMobileMenuOpen(false);
    toggleRef.current?.focus();
  }

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-secondary-lighter/70 bg-background-base/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-22 max-w-[1200px] items-center justify-between gap-6 px-6">
        <Link href="/" aria-label="BAGLOBAL — início" className="relative z-20 shrink-0">
          <Image src={logo} alt="BAGLOBAL" width={240} height={33} sizes="(min-width: 768px) 240px, 190px" className="h-auto w-[190px] md:w-[240px]" preload />
        </Link>
        <nav aria-label="Navegação principal" className="hidden items-center gap-5 xl:flex">
          {navLinks.map((link) => <Link key={link.href} href={link.href} className="py-3 text-sm text-foreground-muted hover:text-primary">{link.name}</Link>)}
          <Link href="/login" className="border-l border-secondary-lighter px-4 py-3 text-sm">Área do cliente</Link>
          <Link href="#contato" className="btn-primary whitespace-nowrap px-5 py-3 text-sm">Solicitar contato</Link>
        </nav>
        <button ref={toggleRef} type="button" onClick={() => setIsMobileMenuOpen((open) => !open)} aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={isMobileMenuOpen} aria-controls="mobile-menu" className="relative z-20 flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-secondary-lighter text-foreground xl:hidden">
          <svg aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d={isMobileMenuOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </div>
      {isMobileMenuOpen && <nav ref={menuRef} id="mobile-menu" aria-label="Navegação móvel" className="fixed inset-x-0 top-22 h-[calc(100dvh-5.5rem)] overflow-y-auto bg-background-base px-6 py-8 xl:hidden">
        <div className="mx-auto flex max-w-lg flex-col gap-2">
          {navLinks.map((link) => <Link key={link.href} href={link.href} onClick={closeMenu} className="border-b border-secondary-lighter py-4 text-xl font-semibold">{link.name}</Link>)}
          <Link href="/login" onClick={closeMenu} className="py-4 text-lg text-foreground-muted">Área do cliente</Link>
          <Link href="#contato" onClick={closeMenu} className="btn-primary px-6 py-4 text-center">Solicitar contato</Link>
        </div>
      </nav>}
    </header>
  );
}
