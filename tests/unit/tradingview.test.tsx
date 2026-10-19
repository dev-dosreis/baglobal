// @vitest-environment jsdom
import { StrictMode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TradingViewTicker } from '@/components/Sections';
import nextConfig from '../../next.config';

const scriptSelector = 'script[src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"]';

describe('TradingView no site', () => {
  it('incorpora automaticamente as mesmas três cotações e aparência do ticker original', () => {
    render(<TradingViewTicker />);
    const script = document.querySelector<HTMLScriptElement>(scriptSelector);
    expect(script).not.toBeNull();
    expect(script!.async).toBe(true);
    expect(JSON.parse(script!.textContent!)).toEqual({
      symbols: [
        { proName: 'FX_IDC:USDBRL', title: 'USD / BRL' },
        { proName: 'BINANCE:USDTBRL', title: 'USDT / BRL' },
        { proName: 'BINANCE:BTCUSDT', title: 'BTC / USDT' },
      ],
      showSymbolLogo: true, colorTheme: 'dark', isTransparent: true, displayMode: 'adaptive', locale: 'br',
    });
    expect(screen.getByRole('complementary', { name: 'Cotações de mercado' })).toBeInTheDocument();
  });

  it('não duplica o widget em StrictMode e remove o que criou ao desmontar', () => {
    const { unmount } = render(<StrictMode><TradingViewTicker /></StrictMode>);
    expect(document.querySelectorAll(scriptSelector)).toHaveLength(1);
    unmount();
    expect(document.querySelectorAll(scriptSelector)).toHaveLength(0);
  });

  it('oferece fallback apenas se o script falhar', () => {
    render(<TradingViewTicker />);
    expect(screen.queryByText(/Cotações temporariamente indisponíveis/)).toBeNull();
    const script = document.querySelector(scriptSelector);
    expect(script).not.toBeNull();
    fireEvent.error(script!);
    expect(screen.getByText(/Cotações temporariamente indisponíveis/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver no TradingView/ })).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('permite o iframe do widget sem liberar iframes de qualquer origem ou alterar cache', async () => {
    const rules = await nextConfig.headers!();
    const csp = rules[0].headers.find(({ key }) => key === 'Content-Security-Policy')!.value;
    expect(csp.split(';').find((directive) => directive.trim().startsWith('frame-src'))?.trim()).toBe('frame-src https://www.tradingview-widget.com');
    expect(csp).toContain("frame-ancestors 'none'");
    expect(rules[0].headers.some(({ key }) => key.toLowerCase() === 'cache-control')).toBe(false);
  });
});
