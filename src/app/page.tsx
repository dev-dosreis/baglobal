import type { Metadata } from "next";
import { Header, TradingViewTicker, Hero, Solutions, Timeline, Compliance, Institutional, Contact, FAQ, Footer } from "@/components/Sections";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="min-h-screen pt-22">
        <TradingViewTicker />
        <Hero />
        <Solutions />
        <Timeline />
        <Compliance />
        <Institutional />
        <Contact />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
