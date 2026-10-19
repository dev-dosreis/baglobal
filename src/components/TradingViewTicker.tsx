"use client";

import { useEffect, useRef, useState } from "react";

export function TradingViewTicker() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // The provider owns this subtree; React only owns the empty host around it.
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container";
    const content = document.createElement("div");
    content.className = "tradingview-widget-container__widget";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.textContent = JSON.stringify({
      symbols: [
        { proName: "FX_IDC:USDBRL", title: "USD / BRL" },
        { proName: "BINANCE:USDTBRL", title: "USDT / BRL" },
        { proName: "BINANCE:BTCUSDT", title: "BTC / USDT" },
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "br",
    });
    const handleError = () => setHasError(true);
    script.addEventListener("error", handleError, { once: true });
    widget.append(content, script);
    host.append(widget);
    return () => {
      script.removeEventListener("error", handleError);
      widget.remove();
    };
  }, []);

  return (
    <aside aria-label="Cotações de mercado" className="w-full overflow-hidden border-b border-secondary-lighter bg-background-base/50 py-1">
      <div ref={hostRef} id="tradingview-ticker-container" className={hasError ? "hidden" : "min-h-[84px] w-full md:min-h-[58px] overflow-hidden"} />
      {hasError && <p aria-live="polite" className="flex min-h-[84px] flex-wrap md:min-h-[58px] items-center justify-center gap-x-3 px-4 text-center text-sm text-foreground-muted">
        <span>Cotações temporariamente indisponíveis.</span>
        <a href="https://www.tradingview.com/markets/currencies/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ver no TradingView ↗</a>
      </p>}
      <noscript><p className="px-4 text-center text-sm text-foreground-muted">Ative o JavaScript para ver as cotações do TradingView.</p></noscript>
    </aside>
  );
}
