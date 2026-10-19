import { test, expect } from './fixtures';

const providerScript = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';

test('TradingView carrega no site com as três cotações originais e iframe permitido', async ({ page }) => {
  await page.route(providerScript, (route) => route.fulfill({
    contentType: 'application/javascript',
    body: `const script = document.currentScript;
      const frame = document.createElement('iframe');
      frame.src = 'https://www.tradingview-widget.com/embed-widget/ticker-tape/';
      frame.title = 'Ticker TradingView';
      frame.style.cssText = 'width:100%;height:84px;border:0';
      script.parentElement.prepend(frame);`,
  }));
  await page.route('https://www.tradingview-widget.com/embed-widget/ticker-tape/**', (route) => route.fulfill({
    contentType: 'text/html; charset=utf-8',
    body: '<html lang="pt-BR"><title>TradingView simulado</title><body>USD / BRL · USDT / BRL · BTC / USDT</body></html>',
  }));
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto('/');
  expect(response?.headers()['content-security-policy']).toContain('frame-src https://www.tradingview-widget.com');
  const ticker = page.getByRole('complementary', { name: 'Cotações de mercado' });
  await expect(ticker.locator('iframe')).toBeVisible();
  await expect(ticker.frameLocator('iframe').locator('body')).toContainText('USD / BRL · USDT / BRL · BTC / USDT');
  const config = await ticker.locator('script').evaluate((script) => JSON.parse(script.textContent!));
  expect(config).toMatchObject({
    symbols: [
      { proName: 'FX_IDC:USDBRL', title: 'USD / BRL' },
      { proName: 'BINANCE:USDTBRL', title: 'USDT / BRL' },
      { proName: 'BINANCE:BTCUSDT', title: 'BTC / USDT' },
    ], colorTheme: 'dark', displayMode: 'adaptive', locale: 'br',
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('falha do TradingView mantém a página funcionando e oferece alternativa', async ({ page }) => {
  await page.route(providerScript, (route) => route.abort('failed'));
  await page.goto('/');
  const ticker = page.getByRole('complementary', { name: 'Cotações de mercado' });
  await expect(ticker).toContainText('Cotações temporariamente indisponíveis.');
  await expect(ticker.getByRole('link', { name: /Ver no TradingView/ })).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('#contato')).toBeAttached();
});
