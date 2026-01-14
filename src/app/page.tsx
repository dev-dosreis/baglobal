import { Header, TradingViewTicker, Hero, Solutions, Timeline, Compliance, Institutional, Contact, FAQ, Footer, WhatsAppWidget } from "@/components/Sections";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-20"> {/* Offset for sticky header */}
        <TradingViewTicker />
      </div>
      <Hero />
      <Solutions />
      <Timeline />
      <Compliance />
      <Institutional />
      <Contact />
      <FAQ />
      <Footer />
      <WhatsAppWidget />
    </main>
  );
}
